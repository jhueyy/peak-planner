"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var feature_svc_exports = {};
__export(feature_svc_exports, {
  default: () => feature_svc_default
});
module.exports = __toCommonJS(feature_svc_exports);
var import_mongoose = require("mongoose");
const FeatureSchema = new import_mongoose.Schema(
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
const FeatureModel = (0, import_mongoose.model)("Feature", FeatureSchema);
function index() {
  return FeatureModel.find();
}
function get(id) {
  return FeatureModel.findById(id);
}
var feature_svc_default = { index, get };
