import { CosmosClient } from "@azure/cosmos";

// Initialize lazily to prevent crashing the Azure Functions worker on startup
// if the environment variables are not yet populated.
let clientInstance: CosmosClient | null = null;

export function getClient(): CosmosClient {
    if (!clientInstance) {
        const endpoint = process.env.COSMOS_DB_ENDPOINT || "https://placeholder.documents.azure.com:443/";
        const key = process.env.COSMOS_DB_KEY || "placeholder";
        clientInstance = new CosmosClient({ endpoint, key });
    }
    return clientInstance;
}

export const getDatabase = () => getClient().database("mywebwatcher-db");
export const usersContainer = { get items() { return getDatabase().container("users").items; }, item: (id: string, pk: string) => getDatabase().container("users").item(id, pk) };
export const sitesContainer = { get items() { return getDatabase().container("sites").items; }, item: (id: string, pk: string) => getDatabase().container("sites").item(id, pk) };
export const snapshotsContainer = { get items() { return getDatabase().container("snapshots").items; }, item: (id: string, pk: string) => getDatabase().container("snapshots").item(id, pk) };
export const diffsContainer = { get items() { return getDatabase().container("diffs").items; }, item: (id: string, pk: string) => getDatabase().container("diffs").item(id, pk) };
