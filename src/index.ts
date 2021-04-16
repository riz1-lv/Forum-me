import { MikroORM } from "@mikro-orm/core"
import { __prod__ } from "./constants";

const main = async() =>{

const orm = await MikroORM.init({ entities: ['./entities'], // path to your JS entities (dist), relative to `baseDir`
dbName: 'forumme',
type: 'postgresql',
debug: !__prod__,
clientUrl: '...',})


}

main();
