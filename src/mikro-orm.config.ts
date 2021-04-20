import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import {MikroORM} from "@mikro-orm/core"
import path from 'path'
import { User } from "./entities/User";

export default{ 
  migrations: {
    path: path.join(__dirname,'./migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Post,User], // path to your JS entities (dist), relative to `baseDir`
  dbName: 'forumme',
  type: 'postgresql',
  debug: !__prod__,
  password: process.env.DATABASE_PASSWORD!,
  } as Parameters<typeof MikroORM.init>[0];
   