import { Schema, model } from "mongoose";
import { Trail } from "../models/trail";

const TrailSchema = new Schema<Trail>({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    difficulty: { type: String, required: true },
    tags: [String],
    reviews: [String],
    park: { type: String, required: true }
}, { collection: "trails" });

const TrailModel = model<Trail>("Trail", TrailSchema);

function get(id: string): Promise<Trail | null> {
    return TrailModel.findOne({ id }).catch(() => null);
}

function index(): Promise<Trail[]> {
    return TrailModel.find();
}

function create(json: Trail): Promise<Trail> {
    const t = new TrailModel(json);
    return t.save();
}

function update(id: string, data: Trail): Promise<Trail> {
    return TrailModel.findOneAndUpdate({ id }, data, { new: true }).then((updated) => {
        if (!updated) throw `${id} not updated`;
        return updated;
    });
}

function remove(id: string): Promise<void> {
    return TrailModel.findOneAndDelete({ id }).then((deleted) => {
        if (!deleted) throw `${id} not deleted`;
    });
}

export default { get, index, create, update, remove };
