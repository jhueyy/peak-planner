"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var features_exports = {};
__export(features_exports, {
  default: () => features_default
});
module.exports = __toCommonJS(features_exports);
var import_express = __toESM(require("express"));
var import_feature_svc = __toESM(require("../services/feature-svc"));
const router = import_express.default.Router();
router.get("/", (_, res) => {
  import_feature_svc.default.index().then((list) => res.json(list)).catch((err) => res.status(500).send(err));
});
router.get("/:heading", (req, res) => {
  const { heading } = req.params;
  import_feature_svc.default.get(heading).then((feature) => {
    if (feature) res.json(feature);
    else res.status(404).send("Feature not found");
  }).catch((err) => res.status(500).send(err));
});
router.post("/", (req, res) => {
  const newFeature = req.body;
  import_feature_svc.default.create(newFeature).then((feature) => res.status(201).json(feature)).catch((err) => res.status(500).send("Error creating feature"));
});
router.put("/:heading", (req, res) => {
  const { heading } = req.params;
  const newFeature = req.body;
  import_feature_svc.default.update(heading, newFeature).then((feature) => res.json(feature)).catch((err) => res.status(404).send(err));
});
router.delete("/:heading", (req, res) => {
  const { heading } = req.params;
  import_feature_svc.default.remove(heading).then(() => res.status(204).end()).catch((err) => res.status(404).send(err));
});
var features_default = router;
