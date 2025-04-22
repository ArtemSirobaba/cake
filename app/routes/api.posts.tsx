import { json } from "@remix-run/node";
import Database from "better-sqlite3";

import { auth } from "~/lib/auth";

const db = new Database("./sqlite.db");

const createTableIfNotExists = async () => {
  try {
    const isExists = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='post'"
      )
      .get();
    if (isExists) {
      return;
    }
    const res = db
      .prepare(
        "CREATE TABLE IF NOT EXISTS post (id TEXT PRIMARY KEY, title TEXT NOT NULL, content TEXT NOT NULL, userId TEXT NOT NULL, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL)"
      )
      .run();
    return res;
  } catch (error) {
    console.error(error);
  }
};

export async function loader() {
  await createTableIfNotExists();
  const posts = db.prepare("SELECT * FROM post ORDER BY createdAt DESC").all();
  return json(posts);
}

export async function action({ request }: { request: Request }) {
  const session = await auth.handler(request);
  if (!session) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  if (request.method === "POST") {
    const { title, content, userId } = await request.json();

    if (!title || !content || !userId) {
      return json({ error: "Missing required fields" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(
      "INSERT INTO post (id, title, content, userId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(id, title, content, userId, now, now);

    return json({ id, title, content, userId, createdAt: now, updatedAt: now });
  }

  return json({ error: "Method not allowed" }, { status: 405 });
}
