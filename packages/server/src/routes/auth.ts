import express, { Request, Response, Router, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import credentials from "../services/credential-svc";

dotenv.config();
const router: Router = express.Router();
const TOKEN_SECRET = process.env.TOKEN_SECRET || "NOT_A_SECRET";

function generateAccessToken(username: string): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username },
      TOKEN_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err || !token) reject(err);
        else resolve(token);
      }
    );
  });
}

router.post("/register", (req: Request, res: Response): void => {
  const { username, password } = req.body;

  if (typeof username !== "string" || typeof password !== "string") {
    res.status(400).send("Bad request: Invalid input data.");
    return;
  }

  credentials
    .create(username, password)
    .then((creds) => generateAccessToken(creds.username))
    .then((token) => res.status(201).send({ token }))
    .catch((err) =>
      res.status(409).send({ error: (err as Error).message || err })
    );
});

router.post("/login", (req: Request, res: Response): void => {
  console.log("Login attempt received:", { username: req.body.username });
  const { username, password } = req.body;

  if (!username || !password) {
    console.log("Login failed: Missing credentials");
    res.status(400).send("Bad request: Missing credentials.");
    return;
  }

  credentials
    .verify(username, password)
    .then((user: string) => {
      console.log("Credentials verified for user:", user);
      return generateAccessToken(user);
    })
    .then((token) => {
      console.log("Token generated successfully");
      res.status(200).send({ token });
    })
    .catch((error) => {
      console.log("Login failed:", error);
      res.status(401).send("Unauthorized");
    });
});


export function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).send("Missing token.");
    return;
  }

  jwt.verify(token, TOKEN_SECRET, (error, decoded) => {
    if (error || !decoded) {
      res.status(403).send("Invalid or expired token.");
      return;
    }

    next();
  });
}

export default router;
