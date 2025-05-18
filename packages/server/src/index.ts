import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import features from "./routes/features";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

// Middleware
app.use(express.static(staticDir));
app.use(express.json());

// Mount the REST API
app.use("/api/features", features);

// Optional test route
app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

// Connect to database
connect("peak");

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
