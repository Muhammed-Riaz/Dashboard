
import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET|| "production",
  useCdn: false, // False to get fresh data
  apiVersion: "2024-01-31", // Latest API version
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN, // Use API Token for Auth
});
