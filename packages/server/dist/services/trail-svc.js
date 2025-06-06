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
var trail_svc_exports = {};
__export(trail_svc_exports, {
  default: () => trail_svc_default
});
module.exports = __toCommonJS(trail_svc_exports);
var import_mongoose = require("mongoose");
const TrailSchema = new import_mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    difficulty: { type: String, required: true },
    tags: [String],
    reviews: [String],
    park: { type: String, required: true }
  },
  { collection: "trails" }
);
const TrailModel = (0, import_mongoose.model)("Trail", TrailSchema);
function get(id) {
  return TrailModel.findOne({ id }).catch(() => null);
}
function index() {
  return TrailModel.find();
}
function create(json) {
  const t = new TrailModel(json);
  return t.save();
}
function update(id, data) {
  return TrailModel.findOneAndUpdate({ id }, data, { new: true }).then((updated) => {
    if (!updated) throw new Error(`${id} not updated`);
    return updated;
  });
}
function remove(id) {
  return TrailModel.findOneAndDelete({ id }).then((deleted) => {
    if (!deleted) throw new Error(`${id} not deleted`);
  });
}
var trail_svc_default = { get, index, create, update, remove };
