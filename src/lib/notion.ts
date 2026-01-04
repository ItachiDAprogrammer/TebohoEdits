import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

export async function fetchVideosFromNotion() {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
  });

  return response.results;
}
