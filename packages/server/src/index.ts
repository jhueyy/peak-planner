import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import Featured from "./services/featured-svc"; // NEW import

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

// Connect to MongoDB
connect("peak"); // or whatever your db name is

// Serve static frontend (e.g. from proto/dist)
app.use(express.static(staticDir));

// Sample route to confirm server is working
app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

// NEW: Route to fetch a single featured item by ID
app.get("/featured/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  Featured.get(id).then((data) => {
    if (data) {
      res.set("Content-Type", "application/json").send(JSON.stringify(data));
    } else {
      res.status(404).send(); // Not Found
    }
  });
});

// NEW: Route to fetch all featured items (optional, but helpful)
app.get("/featured", (_req: Request, res: Response) => {
  Featured.index().then((data) => {
    res.set("Content-Type", "application/json").send(JSON.stringify(data));
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
