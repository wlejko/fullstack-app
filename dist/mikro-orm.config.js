"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const Entities_1 = require("./Entities");
const path_1 = __importDefault(require("path"));
exports.default = {
    dbName: "test",
    user: "postgres",
    password: "postgre",
    type: "postgresql",
    debug: !constants_1.__prod__,
    entities: [Entities_1.Post, Entities_1.User],
    migrations: {
        path: path_1.default.join(__dirname, "./Migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
};
//# sourceMappingURL=mikro-orm.config.js.map