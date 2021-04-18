import { Post } from "../entities/Post";
import { myContext } from "src/types";
import { Ctx, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver{
  @Query(() => [Post])
  posts(@Ctx() {em}: myContext): Promise<Post[]> {
    return em.find(Post,{});
  }
}