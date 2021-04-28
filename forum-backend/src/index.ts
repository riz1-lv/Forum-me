require('dotenv').config()

import 'reflect-metadata';
import { MikroORM } from "@mikro-orm/core";
import { COOKIE_NAME, __prod__ } from "./constants";
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
import cors from 'cors'



const pgStore = PgStore(session)


const main = async() =>{
const orm = await MikroORM.init(MicroConfig)
await orm.getMigrator().up();



const app = express();

const pgPool = new pg.Pool({
  user: process.env.DATABASE_USER!,
  database: process.env.DATABASE_NAME!,
  password: process.env.DATABASE_PASSWORD!,
  port: parseInt(process.env.DATABASE_PORT!),
})

app.use(cors({
  origin:'http://localhost:3000',
  credentials:true,
}))

app.use(session({
  name:COOKIE_NAME,
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
  context: ({req, res}) => ({em: orm.em, req, res, pgPool})
})

apolloServer.applyMiddleware({
  app,
  cors:false});

app.listen(4000, ()=>{
  console.log("server started on localhost:4000")
})

}
main().catch((err)=>{
  console.error(err);
  console.log(err)
});