import { DocumentManager } from "@y-sweet/sdk";
import { Request, Response } from "express";
import express from "express";
import cors from "cors";

const CONNECTION_STRING =
  "ys://AAAgcrL7m-baWa1c3JQzWcEj5Gz6jjMyEE8cMhNegXltoOw@127.0.0.1:8080";
const manager = new DocumentManager(CONNECTION_STRING);

export async function getYsweetToken(req: Request, res: Response) {
  const body = req.body;
  console.log(body);
  const docId = body.docId;
  try {
    const clientToken = await manager.getOrCreateDocAndToken(docId, {
      userId: "user-id-123", // Replace with your user ID
      validForSeconds: 3600,
      authorization: "full",
    });
    console.log({ clientToken });
    res.send({ clientToken });
    return;
  } catch (error) {
    console.error("Error getting or creating document and token:", error);
    res.status(500).send({
      error:
        "Failed to get or create document and token. Possibly sweet server is not running.",
    });
    return;
  }
}

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.send("Hello ESM + TypeScript!");
});

app.post("/api/get-token", getYsweetToken);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
