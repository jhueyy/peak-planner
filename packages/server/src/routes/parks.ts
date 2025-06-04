import express, { Request, Response } from "express";
import ParkService from "../services/park-svc";
import { Park } from "../models/park";

const router = express.Router();

router.get("/:id", (req: Request, res: Response) => {
    const { id } = req.params;

    ParkService.get(id)
        .then((park: Park | null) => {
            if (park) res.json(park);
            else res.status(404).send(`Park with id ${id} not found`);
        })
        .catch((err) => res.status(500).send(err));
});

export default router;
