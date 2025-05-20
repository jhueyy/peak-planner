import { Schema, model } from "mongoose";
import { Featured } from "../models/featured";

const FeaturedSchema = new Schema<Featured>({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  href: { type: String, required: true },
  image: String
}, { collection: "featured" });

const FeaturedModel = model<Featured>("Featured", FeaturedSchema);

function index(): Promise<Featured[]> {
  return FeaturedModel.find();
}

function get(id: string): Promise<Featured | null> {
  return FeaturedModel.findOne({ id }).catch(() => null);
}

function create(json: Featured): Promise<Featured> {
  const f = new FeaturedModel(json);
  return f.save();
}

function update(id: string, featured: Featured): Promise<Featured> {
  return FeaturedModel.findOneAndUpdate({ id }, featured, { new: true }).then((updated) => {
    if (!updated) throw `${id} not updated`;
    return updated;
  });
}

function remove(id: string): Promise<void> {
  return FeaturedModel.findOneAndDelete({ id }).then((deleted) => {
    if (!deleted) throw `${id} not deleted`;
  });
}

export default { index, get, create, update, remove };
