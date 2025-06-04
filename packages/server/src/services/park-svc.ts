import { Schema, model } from "mongoose";
import { Park } from "../models/park";

const ParkSchema = new Schema<Park>({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    trails: [String] // trail ids
}, { collection: "parks" });

const ParkModel = model<Park>("Park", ParkSchema);

function get(id: string): Promise<Park | null> {
    return ParkModel.findOne({ id }).catch(() => null);
}

function index(): Promise<Park[]> {
    return ParkModel.find();
}

function create(json: Park): Promise<Park> {
    const p = new ParkModel(json);
    return p.save();
}

function update(id: string, data: Park): Promise<Park> {
    return ParkModel.findOneAndUpdate({ id }, data, { new: true }).then((updated) => {
        if (!updated) throw `${id} not updated`;
        return updated;
    });
}

function remove(id: string): Promise<void> {
    return ParkModel.findOneAndDelete({ id }).then((deleted) => {
        if (!deleted) throw `${id} not deleted`;
    });
}

export default { get, index, create, update, remove };
