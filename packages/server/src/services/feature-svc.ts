import { Schema, model } from "mongoose";
import { Feature } from "../models/feature";

// Define Mongoose schema
const FeatureSchema = new Schema<Feature>(
  {
    icon: { type: String, required: true, trim: true },
    heading: { type: String, required: true, trim: true },
    items: [
      {
        label: { type: String, required: true, trim: true },
        href: { type: String, required: true, trim: true }
      }
    ]
  },
  { collection: "features" }
);

// Create the model
const FeatureModel = model<Feature>("Feature", FeatureSchema);

// Export service functions
function index(): Promise<Feature[]> {
  return FeatureModel.find();
}

function get(id: string): Promise<Feature | null> {
  return FeatureModel.findById(id);
}

export default { index, get };
