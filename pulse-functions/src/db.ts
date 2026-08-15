import { CosmosClient } from "@azure/cosmos";

const endpoint = process.env.COSMOS_DB_ENDPOINT || "";
const key = process.env.COSMOS_DB_KEY || "";

export const client = new CosmosClient({ endpoint, key });
export const database = client.database("pulse-db");
export const usersContainer = database.container("users");
export const sitesContainer = database.container("sites");
export const snapshotsContainer = database.container("snapshots");
export const diffsContainer = database.container("diffs");
