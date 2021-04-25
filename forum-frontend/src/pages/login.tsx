import React from 'react'
import {Form, Formik} from 'formik'
import { Box, Button} from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import {useRouter} from 'next/router'
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
  


 const Login: React.FC<{}> = ({}) => {
    const router = useRouter();
    const [{},login] = useLoginMutation();
    return (
    <Wrapper>
      <Formik 
      initialValues={{username:"" , password:""}}
       onSubmit={async (values,{setErrors})=>{
       const response = await login({ options: values})
      
       if(response.data?.login.errors){
          setErrors(toErrorMap(response.data.login.errors)
          )
       }
       else if(response.data?.login.user){
        //successfully Registered
        router.push('/');
       }
     }}
       >
        {({isSubmitting})=>(
          <Form>
            <InputField name="username" label="Username" placeholder="username"/>
            <Box mt={4}>
              <InputField name="password" label="Password" placeholder="password" type="password"/>
            </Box>
          <Button type="submit" mt={4} isLoading={isSubmitting} colorScheme="teal" >Login</Button>
          </Form>
        )}
        </Formik>
      </Wrapper>
        )
        
      }
      
export default Login;