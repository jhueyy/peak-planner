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
var park_svc_exports = {};
__export(park_svc_exports, {
  default: () => park_svc_default
});
module.exports = __toCommonJS(park_svc_exports);
var import_mongoose = require("mongoose");
const ParkSchema = new import_mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  trails: [String]
  // trail ids
}, { collection: "parks" });
const ParkModel = (0, import_mongoose.model)("Park", ParkSchema);
function get(id) {
  return ParkModel.findOne({ id }).catch(() => null);
}
function index() {
  return ParkModel.find();
}
function create(json) {
  const p = new ParkModel(json);
  return p.save();
}
function update(id, data) {
  return ParkModel.findOneAndUpdate({ id }, data, { new: true }).then((updated) => {
    if (!updated) throw `${id} not updated`;
    return updated;
  });
}
function remove(id) {
  return ParkModel.findOneAndDelete({ id }).then((deleted) => {
    if (!deleted) throw `${id} not deleted`;
  });
}
var park_svc_default = { get, index, create, update, remove };
