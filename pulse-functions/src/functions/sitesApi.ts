import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { sitesContainer } from "../db";
import crypto from "crypto";

export async function getSites(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const { resources: sites } = await sitesContainer.items.readAll().fetchAll();
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

    try {
        const body = await request.text();
        const data = JSON.parse(body);

        if (!data.url || !data.name) {
            return { status: 400, body: "Missing url or name" };
        }

        const newSite = {
            id: crypto.randomUUID(),
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
