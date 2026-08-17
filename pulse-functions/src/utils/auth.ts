import { HttpRequest } from "@azure/functions";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_do_not_use_in_prod";

export function getUserIdFromRequest(request: HttpRequest): string | null {
    const authHeader = request.headers.get("x-pulse-auth") || request.headers.get("X-Pulse-Auth");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
    
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        return decoded.userId;
    } catch (e) {
        return null;
    }
}
