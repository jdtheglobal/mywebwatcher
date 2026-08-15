import { app, InvocationContext } from "@azure/functions";
import { sitesContainer, snapshotsContainer, diffsContainer } from "../db";
import crypto from "crypto";
import { JSDOM } from "jsdom";
import { diff_match_patch } from "diff-match-patch";
import OpenAI from "openai";

const openai = new OpenAI(); // Automatically uses process.env.OPENAI_API_KEY

export async function diffProcessor(queueItem: unknown, context: InvocationContext): Promise<void> {
    context.log('Storage queue function processed work item:', queueItem);
    
    let message;
    if (typeof queueItem === 'string') {
        message = JSON.parse(queueItem);
    } else {
        message = queueItem as any;
    }

    const { siteId, url } = message;

    if (!siteId || !url) {
        context.warn('Invalid queue item format');
        return;
    }

    try {
        // Fetch current HTML
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        const html = await response.text();

        // Extract meaningful text using JSDOM
        const dom = new JSDOM(html);
        const textContent = dom.window.document.body?.textContent?.replace(/\s+/g, ' ').trim() || "";

        // Get latest snapshot for comparison
        const querySpec = {
            query: "SELECT * from c WHERE c.siteId = @siteId ORDER BY c.createdAt DESC OFFSET 0 LIMIT 1",
            parameters: [{ name: "@siteId", value: siteId }]
        };
        const { resources: lastSnapshots } = await snapshotsContainer.items.query(querySpec).fetchAll();
        const lastSnapshot = lastSnapshots.length > 0 ? lastSnapshots[0] : null;

        let hasChanges = false;
        let diffSummary = "Initial snapshot created.";
        let severity = "Info";

        if (lastSnapshot) {
            const dmp = new diff_match_patch();
            const diffs = dmp.diff_main(lastSnapshot.textContent || "", textContent);
            dmp.diff_cleanupSemantic(diffs);

            // Filter for actual changes ignoring pure whitespace
            const significantChanges = diffs.filter(d => d[0] !== 0 && d[1].trim().length > 0);

            if (significantChanges.length > 0) {
                hasChanges = true;
                
                // Format diffs for OpenAI
                let diffPrompt = "Here are the changes detected:\n";
                significantChanges.forEach(d => {
                    const action = d[0] === 1 ? "ADDED" : "REMOVED";
                    diffPrompt += `[${action}]: ${d[1]}\n`;
                });

                try {
                    const completion = await openai.chat.completions.create({
                        model: "gpt-4o-mini",
                        messages: [
                            { role: "system", content: "You are an AI that summarizes website text changes briefly and clearly. Focus on the most important updates like price changes, new announcements, or out-of-stock statuses. Keep it under 2 sentences." },
                            { role: "user", content: diffPrompt }
                        ]
                    });
                    diffSummary = completion.choices[0].message.content || "Changes detected but could not be summarized.";
                    severity = "Medium"; // Could be dynamically determined by AI later
                } catch (aiError: any) {
                    context.error("OpenAI Error:", aiError);
                    diffSummary = "Changes detected (AI summarization failed).";
                }
            }
        } else {
            hasChanges = true;
        }

        if (hasChanges) {
            // Save new snapshot
            const snapshotId = crypto.randomUUID();
            await snapshotsContainer.items.create({
                id: snapshotId,
                siteId,
                textContent,
                createdAt: new Date().toISOString()
            });

            // Save diff record
            await diffsContainer.items.create({
                id: crypto.randomUUID(),
                siteId,
                snapshotId,
                summary: diffSummary,
                severity,
                createdAt: new Date().toISOString()
            });
            context.log(`Saved new snapshot and diff for ${url}. Summary: ${diffSummary}`);

            // Webhook/Email Alert Trigger
            if (severity === "Medium" || severity === "High") {
                context.log(`[ALERT TRIGGERED] Severity ${severity} change detected for ${url}. Dispatching notifications...`);
                // TODO: Implement actual webhook POST or SMTP email send here.
                // e.g. await fetch(site.webhookUrl, { method: 'POST', body: JSON.stringify({ summary: diffSummary }) });
            }
        }

        // Update site lastChecked
        const { resource: site } = await sitesContainer.item(siteId, siteId).read();
        if (site) {
            site.lastChecked = new Date().toISOString();
            await sitesContainer.items.upsert(site);
        }

    } catch (error: any) {
        context.error(`Error processing diff for site ${siteId}:`, error);
    }
}

app.storageQueue('diffProcessor', {
    queueName: 'site-checks',
    connection: 'AzureWebJobsStorage',
    handler: diffProcessor
});
