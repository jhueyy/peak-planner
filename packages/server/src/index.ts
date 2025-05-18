import express, { Request, Response } from "express";
import { connect } from "./services/mongo"
import Features from "./services/feature-svc";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.get("/features", async (req: Request, res: Response) => {
  try {
    const data = await Features.index();
    res.set("Content-Type", "application/json").send(JSON.stringify(data));
  } catch (err) {
    res.status(500).send("Error fetching features");
  }
});



connect("peak");

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
