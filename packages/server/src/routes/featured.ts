import express, { Request, Response } from "express";
import { Featured } from "../models/featured"; // your interface
import FeaturedService from "../services/featured-svc"; //crud

const router = express.Router();

// GET all
router.get("/", (_, res: Response) => {
  FeaturedService.index()
    .then((list: Featured[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

// GET by ID
router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  FeaturedService.get(id)
    .then((item: Featured | null) => {
      if (item) {
        res.json(item);
      } else {
        res.status(404).send(`Featured item with id ${id} not found`);
      }
    })
    .catch((err) => res.status(500).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newFeatured = req.body;

  FeaturedService.create(newFeatured)
    .then((created: Featured) => res.status(201).json(created))
    .catch((err) => res.status(500).send(err));
});

router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;

  FeaturedService.update(id, updatedData)
  .then((updated: Featured | null) => {
    if (updated) res.json(updated);
    else res.status(404).send(`Item ${id} not found`);
  })
  .catch((err) => res.status(500).send(err));
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  FeaturedService.remove(id)
    .then(() => res.status(204).end()) // No Content
    .catch((err) => res.status(404).send(err));
});

export default router;
