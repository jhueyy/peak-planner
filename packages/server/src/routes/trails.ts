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

export default router;
