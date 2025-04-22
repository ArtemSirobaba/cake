import { json } from "@remix-run/node";
import Database from "better-sqlite3";
import { auth } from "~/lib/auth";

const db = new Database("./sqlite.db");

const createTableIfNotExists = async ({ postId }: { postId: string }) => {
  try {
    const isExists = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='comment'"
      )
      .get();
    if (isExists) {
      return;
    }
    const res = db
      .prepare(
        "CREATE TABLE IF NOT EXISTS comment (id TEXT PRIMARY KEY, content TEXT NOT NULL, userId TEXT NOT NULL, postId TEXT NOT NULL, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL)"
      )
      .run();
    return res;
  } catch (error) {
    console.error(error);
  }
};

export async function loader({ params }: { params: { postId: string } }) {
  await createTableIfNotExists({ postId: params.postId });
  const comments = db
    .prepare(
      `SELECT c.*, u.name as userName 
       FROM comment c 
       JOIN user u ON c.userId = u.id 
       WHERE c.postId = ? 
       ORDER BY c.createdAt DESC`
    )
    .all(params.postId);
  return json(comments);
}

export async function action({
  request,
  params,
}: {
  request: Request;
  params: { postId: string };
}) {
  const session = await auth.handler(request);
  if (!session) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  if (request.method === "POST") {
    const { content, userId } = await request.json();

    if (!content || !userId) {
      return json({ error: "Missing required fields" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await createTableIfNotExists({ postId: params.postId });

    db.prepare(
      "INSERT INTO comment (id, content, userId, postId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(id, content, userId, params.postId, now, now);

    const comment = db
      .prepare(
        `SELECT c.*, u.name as userName 
         FROM comment c 
         JOIN user u ON c.userId = u.id 
         WHERE c.id = ?`
      )
      .get(id);

    return json(comment);
  }

  return json({ error: "Method not allowed" }, { status: 405 });
}
