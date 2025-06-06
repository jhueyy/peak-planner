"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_express = __toESM(require("express"));
var import_mongo = require("./services/mongo");
var import_featured = __toESM(require("./routes/featured"));
var import_auth = __toESM(require("./routes/auth"));
var import_trails = __toESM(require("./routes/trails"));
var import_parks = __toESM(require("./routes/parks"));
var import_promises = __toESM(require("node:fs/promises"));
var import_path = __toESM(require("path"));
const app = (0, import_express.default)();
const port = process.env.PORT || 3e3;
const staticDir = process.env.STATIC || "../app/dist";
(0, import_mongo.connect)("peak");
app.use(import_express.default.static(staticDir));
app.use(import_express.default.json());
app.use(import_express.default.urlencoded({ extended: true }));
app.use("/auth", import_auth.default);
app.use("/api/featured", import_auth.authenticateUser, import_featured.default);
app.use("/api/trails", import_auth.authenticateUser, import_trails.default);
app.use("/api/parks", import_auth.authenticateUser, import_parks.default);
app.get("/hello", (req, res) => {
  res.send("Hello, World");
});
app.use("/app", (req, res) => {
  const indexHtml = import_path.default.resolve(staticDir, "index.html");
  import_promises.default.readFile(indexHtml, "utf-8").then((html) => res.send(html));
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
