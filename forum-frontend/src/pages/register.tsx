import React from 'react'
import {Form, Formik} from 'formik'
import { Box, Button} from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import {useRouter} from 'next/router'
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
interface registerProps {}
  


 const Register: React.FC<registerProps> = ({}) => {
    const router = useRouter();
    const [{},register] = useRegisterMutation();
    return (
    <Wrapper>
      <Formik 
      initialValues={{email:"", username:"" , password:""}}
       onSubmit={async (values,{setErrors})=>{
       const response = await register({options: values})
      
       if(response.data?.register.errors){
          setErrors(toErrorMap(response.data.register.errors)
          )
       }
       else if(response.data?.register.user){
        //successfully Registered
        router.push('/');
       }
     }}
       >
        {({isSubmitting})=>(
          <Form>
            <InputField name="username" label="Username" placeholder="username"/>
            <Box mt={4}>
              <InputField name="email" label="Email" placeholder="email" type="email"/>
            </Box>
            <Box mt={4}>
              <InputField name="password" label="Password" placeholder="password" type="password"/>
            </Box>
          <Button type="submit" mt={4} isLoading={isSubmitting} colorScheme="teal" >Register</Button>
          </Form>
        )}
        </Formik>
      </Wrapper>
        )
        
      }
      
export default withUrqlClient(createUrqlClient)(Register);