import React from 'react'
import {Form, Formik} from 'formik'
import { Box, Button} from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
interface registerProps {

}

 const Register: React.FC<registerProps> = ({}) => {
   
    return (
    <Wrapper>
      <Formik 
      initialValues={{username:"" , password:""}}
       onSubmit={(values)=>console.log(values)}>
        {({isSubmitting})=>(
          <Form>
            <InputField name="username" label="Username" placeholder="username"/>
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
      
export default Register;