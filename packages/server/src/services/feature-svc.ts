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

// Service functions
function index(): Promise<Feature[]> {
  return FeatureModel.find();
}

function get(heading: string): Promise<Feature | null> {
  return FeatureModel.findOne({ heading });
}

function create(json: Feature): Promise<Feature> {
  const feature = new FeatureModel(json);
  return feature.save();
}

function update(heading: string, feature: Feature): Promise<Feature> {
  return FeatureModel.findOneAndUpdate({ heading }, feature, { new: true }).then(
    (updated) => {
      if (!updated) throw `${heading} not updated`;
      return updated as Feature;
    }
  );
}

function remove(heading: string): Promise<void> {
  return FeatureModel.findOneAndDelete({ heading }).then((deleted) => {
    if (!deleted) throw `${heading} not deleted`;
  });
}

// Export service API
export default { index, get, create, update, remove };
