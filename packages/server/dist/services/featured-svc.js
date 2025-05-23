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
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  href: { type: String, required: true },
  image: String
}, { collection: "featured" });
const FeaturedModel = (0, import_mongoose.model)("Featured", FeaturedSchema);
function index() {
  return FeaturedModel.find();
}
function get(id) {
  return FeaturedModel.findOne({ id }).catch(() => null);
}
function create(json) {
  const f = new FeaturedModel(json);
  return f.save();
}
function update(id, featured) {
  return FeaturedModel.findOneAndUpdate({ id }, featured, { new: true }).then((updated) => {
    if (!updated) throw `${id} not updated`;
    return updated;
  });
}
function remove(id) {
  return FeaturedModel.findOneAndDelete({ id }).then((deleted) => {
    if (!deleted) throw `${id} not deleted`;
  });
}
var featured_svc_default = { index, get, create, update, remove };
