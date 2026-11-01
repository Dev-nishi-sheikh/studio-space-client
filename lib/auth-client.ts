import { createAuthClient } from "better-auth/react";

const rawBase = (process.env.NEXT_PUBLIC_API_URL ?? "").trim().replace(/\/+$/, "");

export const authClient = createAuthClient({
  baseURL: rawBase ? `${rawBase}/auth` : "http://localhost:5000/api/auth",
});
