import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { sitesContainer } from "../db";
import crypto from "crypto";
import { getUserIdFromRequest } from "../utils/auth";

export async function getSites(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    
    const userId = getUserIdFromRequest(request);
    if (!userId) return { status: 401, body: "Unauthorized" };

    try {
        const querySpec = {
            query: "SELECT * from c WHERE c.userId = @userId",
            parameters: [{ name: "@userId", value: userId }]
        };
        const { resources: sites } = await sitesContainer.items.query(querySpec).fetchAll();
        return {
            jsonBody: sites
        };
    } catch (error: any) {
        context.error(error);
        return { status: 500, body: "Error fetching sites" };
    }
}

export async function createSite(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const userId = getUserIdFromRequest(request);
    if (!userId) return { status: 401, body: "Unauthorized" };

    try {
        const body = await request.text();
        const data = JSON.parse(body);

        if (!data.url || !data.name) {
            return { status: 400, body: "Missing url or name" };
        }

        const newSite = {
            id: crypto.randomUUID(),
            userId: userId,
            url: data.url,
            name: data.name,
            frequency: data.frequency || "15m",
            status: "Monitoring",
            lastChecked: null,
            createdAt: new Date().toISOString()
        };

        await sitesContainer.items.create(newSite);

        return {
            status: 201,
            jsonBody: newSite
        };
    } catch (error: any) {
        context.error(error);
        return { status: 500, body: "Error creating site" };
    }
}

export async function updateSiteStatus(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const userId = getUserIdFromRequest(request);
    if (!userId) return { status: 401, body: "Unauthorized" };

    const siteId = request.params.id;
    if (!siteId) return { status: 400, body: "Missing site ID" };

    try {
        const body = await request.text();
        const data = JSON.parse(body);

        if (!data.status) {
            return { status: 400, body: "Missing status" };
        }

        // Fetch the existing site
        const { resource: site } = await sitesContainer.item(siteId, siteId).read();
        
        if (!site || site.userId !== userId) {
            return { status: 404, body: "Site not found" };
        }

        // Update status
        site.status = data.status;
        await sitesContainer.item(siteId, siteId).replace(site);

        return {
            status: 200,
            jsonBody: site
        };
    } catch (error: any) {
        context.error(error);
        return { status: 500, body: "Error updating site" };
    }
}

app.http('getSites', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'sites',
    handler: getSites
});

app.http('createSite', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'sites',
    handler: createSite
});

app.http('updateSiteStatus', {
    methods: ['PATCH'],
    authLevel: 'anonymous',
    route: 'sites/{id}/status',
    handler: updateSiteStatus
});
