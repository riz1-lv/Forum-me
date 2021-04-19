
import { User } from "../entities/User";
import { myContext } from "../types";
import { Arg, Field, InputType, Mutation, Query, Ctx , Resolver, ObjectType } from "type-graphql";
import argon2 from 'argon2'

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string
  @Field()
  password: string
}
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
  @Mutation(() => UserResponse)
  async register(
    @Arg('options', ()=> UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() {em}:myContext 
  ):Promise<UserResponse>{
    if(options.username.length <= 2){
      return{
        errors:[
        {
          field:'username',
          message:'username must be at least 3 charachters'
        }
      ]
      }
    }

    if(options.password.length <= 7){
      return{
        errors:[
        {
          field:'password',
          message:'password must have at least 8 characters'
        }
      ]
      }
    }

    const hashedPassword = await argon2.hash(options.password)
    const user = em.create(User, {username: options.username, password: hashedPassword})
    try{
      await em.persistAndFlush(user);
     }
     catch(err){
       if(err.code === '23505' ){
        //duplicate user error
          return{
            errors:[{
              field:"username",
              message:"username already exists"
            }]
          }
       }
     }
    return {user};
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options', ()=> UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() {em}:myContext 
  ): Promise<UserResponse>{
    const user = await em.findOne(User, {username: options.username})
    if(!user){
      return{
        errors: [
          {
          field: 'username',
          message: "username does not exist",
        },
      ],
      }
    }
    const valid = await argon2.verify(user.password, options.password);
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
    return {
      user:user
    };
  }
  @Query(() => [User])
  users(@Ctx() {em}: myContext): Promise<User[]> {
    return em.find(User,{});
  }



}