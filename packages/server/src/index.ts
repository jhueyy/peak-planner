import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import featured from "./routes/featured";
import auth, { authenticateUser } from "./routes/auth";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

// Connect to MongoDB
connect("peak"); // or whatever your db name is

// Serve static frontend (e.g. from proto/dist)
app.use(express.static(staticDir));
app.use(express.json());


app.use("/auth", auth);
app.use("/api/featured", authenticateUser, featured);


// Sample route to confirm server is working
app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});


// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
