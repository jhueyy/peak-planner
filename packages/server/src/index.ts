import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import featured from "./routes/featured";
import auth, { authenticateUser } from "./routes/auth";
import trails from "./routes/trails";
import parks from "./routes/parks";
import fs from "node:fs/promises";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

// Connect to MongoDB
connect("peak"); // or whatever your db name is

// Serve static frontend (e.g. from proto/dist)
app.use(express.static(staticDir));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/auth", auth);
app.use("/api/featured", authenticateUser, featured);
app.use("/api/trails", authenticateUser, trails);
app.use("/api/parks", authenticateUser, parks);


// Sample route to confirm server is working
app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});


app.use("/app", (req: Request, res: Response) => {
  const indexHtml = path.resolve(staticDir, "index.html");
  fs.readFile(indexHtml, "utf-8").then((html) => res.send(html));
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
