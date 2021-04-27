import { cacheExchange, query } from '@urql/exchange-graphcache';
import { dedupExchange, fetchExchange } from 'urql';
import { LogoutMutation, MeQuery, MeDocument, LoginMutation, RegisterMutation } from '../generated/graphql';
import {betterUpdateQuerey} from './betterUpdateQuerey'


export const createUrqlClient = (_ssrExchange:any) => ({ url: 'http://localhost:4000/graphql',
fetchOptions:{
  credentials:"include" as const,
},
exchanges: [dedupExchange, cacheExchange({
  updates:{
    Mutation:{
      logout:(_result, args, cache, _info)=>{
        betterUpdateQuerey<LogoutMutation,MeQuery>
        (cache, {query: MeDocument},_result,
        ()=>({me: null})
        )
      },
      login:(_result, args, cache, _info)=>{
        betterUpdateQuerey<LoginMutation,MeQuery>(cache, {query: MeDocument}, _result, (result,query)=>{
          if(result.login.errors){
            return query
          } else {
            return{
              me: result.login.user,
            }
          }
        })
      },
      register:(_result, args, cache, _info)=>{
        betterUpdateQuerey<RegisterMutation,MeQuery>(cache, {query: MeDocument}, _result, (result,query)=>{
          if(result.register.errors){
            return query
          } else {
            return{
              me: result.register.user,
            }
          }
        })
      }
    }
  }
}),_ssrExchange 
,fetchExchange],})
