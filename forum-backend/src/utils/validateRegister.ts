import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput"

export const validateRegister = (options:UsernamePasswordInput) => {
  if(!options.email.includes("@")){
    return[
      {
        field:'email',
        message:'invalid email'
      }
    ]
    
  }

  if(options.username.length <= 2){
    return [
      {
        field:'username',
        message:'username must be at least 3 charachters'
      },
    ]
    }
  

  if(options.username.includes('@')){
    return [
      {
        field:'username',
        message:'username cannot include @ symbol'
      },
    ]
  }
    

  if(options.password.length <= 7){
    return[
      {
        field:'password',
        message:'password must have at least 8 characters'
      }
    ]
    }
  
  return null;
}