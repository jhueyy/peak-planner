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
var featured_svc_exports = {};
__export(featured_svc_exports, {
  default: () => featured_svc_default
});
module.exports = __toCommonJS(featured_svc_exports);
var import_mongoose = require("mongoose");
const FeaturedSchema = new import_mongoose.Schema({
  id: { type: String, required: true },
  name: String,
  link: String,
  startDate: String,
  endDate: String,
  featuredImage: String
}, { collection: "featured" });
const FeaturedModel = (0, import_mongoose.model)("Featured", FeaturedSchema);
function index() {
  return FeaturedModel.find();
}
function get(id) {
  return FeaturedModel.findOne({ id }).catch(() => null);
}
var featured_svc_default = { index, get };
