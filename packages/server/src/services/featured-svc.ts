import { Schema, model } from "mongoose";
import { Featured } from "../models/featured";

const FeaturedSchema = new Schema<Featured>({
  id: { type: String, required: true },
  name: String,
  link: String,
  startDate: String,
  endDate: String,
  featuredImage: String
}, { collection: "featured" });

const FeaturedModel = model<Featured>("Featured", FeaturedSchema);

function index(): Promise<Featured[]> {
  return FeaturedModel.find();
}

function get(id: string): Promise<Featured | null> {
  return FeaturedModel.findOne({ id }).catch(() => null);
}

export default { index, get };
