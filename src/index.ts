require('dotenv').config()

import 'reflect-metadata';
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import '../.env';
import MicroConfig from './mikro-orm.config';
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from './resolvers/user';
import PgStore from 'connect-pg-simple'
import session from 'express-session'
import { myContext } from './types';
import pg from 'pg'


const pgStore = PgStore(session)

const main = async() =>{
const orm = await MikroORM.init(MicroConfig)
await orm.getMigrator().up();

// const post = orm.em.create(Post,{title:' db Test Post'})
// await orm.em.persistAndFlush(post);
// const post = await orm.em.find(Post,{})
// console.log(post)

const app = express();

const pgPool = new pg.Pool({
  user: process.env.DATABASE_USER!,
  database: process.env.DATABASE_NAME!,
  password: process.env.DATABASE_PASSWORD!,
  port: 5432,
})

app.use(session({
  name:'qid',
  store: new (pgStore)({
    pool: pgPool,
  }),
  secret: process.env.COOKIE_SECRET!,
  resave: false,
  saveUninitialized:false,
  cookie: { 
    maxAge: 30 * 24 * 60 * 60 * 1000,// 30 days
    httpOnly:true,
    secure:__prod__,
    sameSite:'lax'
   } 
}));



const apolloServer = new ApolloServer({
  schema: await buildSchema({
    resolvers: [HelloResolver,PostResolver,UserResolver],
    validate:false,
  }),
  context: ({req, res}):myContext => ({em: orm.em, req, res})
})

apolloServer.applyMiddleware({app});

app.listen(4000, ()=>{
  console.log("server started on localhost:4000")
})

}
main();