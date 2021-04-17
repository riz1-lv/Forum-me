require('dotenv').config()
import { MikroORM } from "@mikro-orm/core"
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import '../.env'
import MicroConfig from './mikro-orm.config'

const main = async() =>{
console.log(process.env.DATABASE_PASSWORD)
const orm = await MikroORM.init(MicroConfig)

await orm.getMigrator().up();
const post = orm.em.create(Post,{title:' db Test Post'})
await orm.em.persistAndFlush(post);
}
main()
