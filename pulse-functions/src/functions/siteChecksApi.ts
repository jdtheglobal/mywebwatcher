import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { sitesContainer, diffsContainer } from "../db";
import { getUserIdFromRequest } from "../utils/auth";

export async function getSiteChanges(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const siteId = request.params.id;
    context.log(`Fetching changes for site ${siteId}`);

    const userId = getUserIdFromRequest(request);
    if (!userId) return { status: 401, body: "Unauthorized" };

    try {
        const querySpec = {
            query: "SELECT * from c WHERE c.siteId = @siteId ORDER BY c.createdAt DESC",
            parameters: [
                { name: "@siteId", value: siteId }
            ]
        };
        const { resources: changes } = await diffsContainer.items.query(querySpec).fetchAll();
        return {
            jsonBody: changes
        };
    } catch (error: any) {
        context.error(error);
        return { status: 500, body: "Error fetching site changes" };
    }
}

export async function triggerSiteCheck(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const siteId = request.params.id;
    context.log(`Manual trigger check for site ${siteId}`);

    const userId = getUserIdFromRequest(request);
    if (!userId) return { status: 401, body: "Unauthorized" };

    try {
        const { resource: site } = await sitesContainer.item(siteId, siteId).read();
        if (!site) {
            return { status: 404, body: "Site not found" };
        }

        // TODO: Enqueue a message to the Storage Queue for the diff processor to handle.
        // For now, we return a success acknowledging the trigger.

        return {
            status: 202,
            body: `Check triggered for site ${siteId}`
        };
    } catch (error: any) {
        context.error(error);
        return { status: 500, body: "Error triggering check" };
    }
}

app.http('getSiteChanges', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'sites/{id}/changes',
    handler: getSiteChanges
});

app.http('triggerSiteCheck', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'sites/{id}/check',
    handler: triggerSiteCheck
});
