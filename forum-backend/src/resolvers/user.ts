
import { User } from "../entities/User";
import { myContext } from "../types";
import { Arg, Field, Mutation, Query, Ctx , Resolver, ObjectType } from "type-graphql";
import argon2 from 'argon2'
import {EntityManager} from '@mikro-orm/postgresql'
import { COOKIE_NAME } from "../constants";
import { validateRegister } from "../utils/validateRegister";
import { UsernamePasswordInput } from "./UsernamePasswordInput";

@ObjectType()
  class FieldError{
    @Field()
      field: string;
    @Field()
      message: string;
  }
  
@ObjectType()
class UserResponse{
  @Field(()=> [FieldError], {nullable:true})
  errors?: FieldError[]

  @Field(()=> User, {nullable:true})
  user?: User
}


@Resolver()
export class UserResolver{
  @Mutation(()=>Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() {em}:myContext 
  ){
    //const user = await em.findOne(User, {email})
    return true;
  }



  @Mutation(() => UserResponse)
  async register(
    @Arg('options', ()=> UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() {em , req}:myContext 
  ):Promise<UserResponse>{
    
    const errors = validateRegister(options);
    if(errors){
      return { errors }
    }

    const hashedPassword = await argon2.hash(options.password)
    let user;
    try{
     const result = await (em as EntityManager)
     .createQueryBuilder(User)
     .getKnexQuery()
     .insert({
        username: options.username, 
        email: options.email,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      }).returning("*");
      user = result[0];
     }
     catch(err){
       if(err.code === '23505' || err.detail.includes("already exists")){
        //duplicate user error
          return{
            errors:[{
              field:"username",
              message:"username already exists"
            }]
          }
       }
     }

     //store userID session aka auto Login
     req.session!.userId = user.id;
     console.log(user)
    return {user};
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password:string,
    @Ctx() {em , req }:myContext 
  ): Promise<UserResponse>{
    const user = await em.findOne(User, 
      usernameOrEmail.includes('@')
       ? {email: usernameOrEmail}
       : {username: usernameOrEmail})
    if(!user){
      return{
        errors: [
          {
          field: 'usernameOrEmail',
          message: "username or email does not exist",
        },
      ],
      }
    }
    const valid = await argon2.verify(user.password, password);
    if(!valid){
      return{
        errors: [
          {
          field: 'password',
          message: "Incorrect password",
        },
      ],
      }
    }

    req.session!.userId = user.id;

    return {
      user:user
    };
  }

  @Query(() => [User])
  users(@Ctx() {em}: myContext): Promise<User[]> {
    return em.find(User,{});
  }

  @Query(()=> User,{nullable:true})
    async me(@Ctx() {req,em}:myContext){
      if(!req.session.userId){
        return null;
      }
      const user = await em.findOne(User,{id: req.session.userId});
      return user;
  }

  @Mutation(()=> Boolean)
    logout(@Ctx() {req, res}:myContext ){
      return new Promise(resolve => req.session.destroy(err =>{
        res.clearCookie(COOKIE_NAME);
        if(err){
          console.log(err)
          resolve(false)
          return
        } 
        resolve(true)
      }))
    }

}