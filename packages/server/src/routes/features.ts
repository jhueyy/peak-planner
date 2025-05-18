import express, { Request, Response } from "express";
import { Feature } from "../models/feature";
import Features from "../services/feature-svc";

const router = express.Router();

// GET all features
router.get("/", (_, res: Response) => {
  Features.index()
    .then((list: Feature[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

// GET single feature by heading
router.get("/:heading", (req: Request, res: Response) => {
  const { heading } = req.params;

  Features.get(heading)
    .then((feature) => {
      if (feature) res.json(feature);
      else res.status(404).send("Feature not found");
    })
    .catch((err) => res.status(500).send(err));
});

// POST a new feature
router.post("/", (req: Request, res: Response) => {
  const newFeature = req.body;

  Features.create(newFeature)
    .then((feature: Feature) => res.status(201).json(feature))
    .catch((err) => res.status(500).send("Error creating feature"));
});

// PUT (update) a feature by heading
router.put("/:heading", (req: Request, res: Response) => {
  const { heading } = req.params;
  const newFeature = req.body;

  Features.update(heading, newFeature)
    .then((feature: Feature) => res.json(feature))
    .catch((err) => res.status(404).send(err));
});

// DELETE a feature by heading
router.delete("/:heading", (req: Request, res: Response) => {
  const { heading } = req.params;

  Features.remove(heading)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;
