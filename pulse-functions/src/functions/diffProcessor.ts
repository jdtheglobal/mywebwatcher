import { app, InvocationContext } from "@azure/functions";
import { sitesContainer, snapshotsContainer, diffsContainer } from "../db";
import { v4 as uuidv4 } from "uuid";

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

        // Get latest snapshot for comparison
        const querySpec = {
            query: "SELECT * from c WHERE c.siteId = @siteId ORDER BY c.createdAt DESC OFFSET 0 LIMIT 1",
            parameters: [{ name: "@siteId", value: siteId }]
        };
        const { resources: lastSnapshots } = await snapshotsContainer.items.query(querySpec).fetchAll();
        const lastSnapshot = lastSnapshots.length > 0 ? lastSnapshots[0] : null;

        let hasChanges = false;
        let diffSummary = "Initial snapshot created.";

        if (lastSnapshot) {
            // Basic length comparison for now (Phase 4 will implement real diffing)
            if (html.length !== lastSnapshot.htmlLength) {
                hasChanges = true;
                diffSummary = `HTML length changed from ${lastSnapshot.htmlLength} to ${html.length}.`;
            }
        } else {
            hasChanges = true;
        }

        if (hasChanges) {
            // Save new snapshot
            const snapshotId = uuidv4();
            await snapshotsContainer.items.create({
                id: snapshotId,
                siteId,
                htmlLength: html.length,
                createdAt: new Date().toISOString()
            });

            // Save diff record
            await diffsContainer.items.create({
                id: uuidv4(),
                siteId,
                snapshotId,
                summary: diffSummary,
                severity: "Low", // To be updated by AI in Phase 4
                createdAt: new Date().toISOString()
            });
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
