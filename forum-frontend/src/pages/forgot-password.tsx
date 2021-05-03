import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';


const ForgotPassword: React.FC<{}> = ({}) => {
  const [,forgotPassword] = useForgotPasswordMutation();
  const [complete, setComplete] = useState(false)
    return (
      <Wrapper>
      <Formik 
      initialValues={{email:""}}
       onSubmit={async (values,{setErrors})=>{
       const response = await forgotPassword(values)
       setComplete(true)
      
     }}
       >
        {({isSubmitting})=> complete? <Box>if an account with that email exists, we sent you an email</Box> : ( 
          <Form>
              <InputField name="email" label="Email" placeholder="email" type="email"/>
          <Button type="submit" mt={4} isLoading={isSubmitting} colorScheme="teal" >Forgot Password</Button>
          </Form>
        )}
        </Formik>
      </Wrapper>
    );
}

export default withUrqlClient(createUrqlClient)(ForgotPassword) 