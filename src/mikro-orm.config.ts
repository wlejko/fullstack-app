import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post, User } from "./Entities";
import path from "path";

export default {
  dbName: "test",
  user: "postgres",
  password: "postgre",
  type: "postgresql",
  debug: !__prod__,
  entities: [Post, User],
  migrations: {
    path: path.join(__dirname, "./Migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
} as Parameters<typeof MikroORM.init>[0];
