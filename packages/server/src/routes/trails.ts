import express, { Request, Response } from "express";
import TrailService from "../services/trail-svc";
import { Trail } from "../models/trail";

const router = express.Router();

router.get("/:id", (req: Request, res: Response) => {
    const { id } = req.params;

    TrailService.get(id)
        .then((trail: Trail | null) => {
            if (trail) res.json(trail);
            else res.status(404).send(`Trail with id ${id} not found`);
        })
        .catch((err) => res.status(500).send(err));
});

// ─── New PUT /api/trails/:id ───
router.put("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedFields = req.body as Partial<Trail>;

    TrailService.update(id, updatedFields)
        .then((updatedTrail: Trail | null) => {
            if (updatedTrail) {
                res.json(updatedTrail);
            } else {
                res.status(404).send(`Trail with id ${id} not found`);
            }
        })
        .catch((err) => {
            console.error("Failed to update trail:", err);
            res.status(500).send(err);
        });
});

export default router;
