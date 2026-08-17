import { app, InvocationContext, HttpRequest, HttpResponseInit } from "@azure/functions";
import { sitesContainer } from "../db";
import { processSiteDiff } from "./diffProcessor";
import { getUserIdFromRequest } from "../utils/auth";

export async function triggerScrape(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('Manual scrape triggered via HTTP');

    // Optional: Protect this endpoint so only the owner or an admin can trigger it manually.
    // For a real production app with external CRON, you'd use a function key instead of user auth.
    // Here we'll allow an authenticated user to trigger their own sites for demonstration.
    const userId = getUserIdFromRequest(request);
    if (!userId) {
        return { status: 401, body: "Unauthorized - Please login to trigger scrape" };
    }

    try {
        const querySpec = {
            query: "SELECT * from c WHERE c.status = 'Monitoring' AND c.userId = @userId",
            parameters: [{ name: "@userId", value: userId }]
        };
        const { resources: sites } = await sitesContainer.items.query(querySpec).fetchAll();

        context.log(`Found ${sites.length} sites to scrape for user ${userId}`);

        const results = [];
        for (const site of sites) {
            context.log(`Scraping site ${site.id} (${site.url})`);
            try {
                // Call the engine directly instead of queuing
                await processSiteDiff(site.id, site.url, context);
                results.push({ siteId: site.id, url: site.url, status: "Success" });
            } catch (err: any) {
                context.error(`Failed to scrape ${site.url}`, err);
                results.push({ siteId: site.id, url: site.url, status: "Failed", error: err.message });
            }
        }

        return {
            status: 200,
            jsonBody: {
                message: `Processed ${sites.length} pulses.`,
                results
            }
        };

    } catch (error: any) {
        context.error('Error in trigger scrape:', error);
        return { status: 500, body: "Internal Server Error during scrape" };
    }
}

app.http('triggerScrape', {
    methods: ['POST'],
    authLevel: 'anonymous', // We handle auth manually in the function
    route: 'trigger-scrape',
    handler: triggerScrape
});
