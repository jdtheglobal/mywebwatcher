import { app, InvocationContext, Timer, output } from "@azure/functions";
import { sitesContainer } from "../db";

const queueOutput = output.storageQueue({
    queueName: 'site-checks',
    connection: 'AzureWebJobsStorage'
});

export async function scheduledCheck(myTimer: Timer, context: InvocationContext): Promise<string[]> {
    context.log('Scheduled check triggered');

    const messages: string[] = [];

    try {
        // Find sites that need to be checked (simplified: checking all active sites for now)
        const querySpec = {
            query: "SELECT * from c WHERE c.status = 'Monitoring'"
        };
        const { resources: sites } = await sitesContainer.items.query(querySpec).fetchAll();

        for (const site of sites) {
            context.log(`Enqueueing check for site ${site.id} (${site.url})`);
            messages.push(JSON.stringify({ siteId: site.id, url: site.url }));
        }

    } catch (error: any) {
        context.error('Error in scheduled check:', error);
    }

    return messages;
}

app.timer('scheduledCheck', {
    schedule: '0 */15 * * * *',
    handler: async (myTimer, context) => {
        const messages = await scheduledCheck(myTimer, context);
        return messages;
    },
    return: queueOutput
});
