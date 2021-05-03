import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';
import NextLink from 'next/link';


 const ChangePassword: NextPage = () => {
  const router = useRouter()
  const [,changePassword] = useChangePasswordMutation()
  const[tokenError, setTokenError] = useState('');
    return (
      <Wrapper>
      <Formik 
      initialValues={{newPassword:""}}
       onSubmit={async (values,{setErrors})=>{
       const response = await changePassword({
         newPassword: values.newPassword,
         token: typeof router.query.token === "string" ? router.query.token : "",
       })
      
       if(response.data?.changePassword.errors){
          const errorMap = toErrorMap(response.data.changePassword.errors)
          if('token' in errorMap){
            setTokenError(errorMap.token)
          }
          setErrors(errorMap)
       }
       else if(response.data?.changePassword.user){
        //successfully Registered
        router.push('/');
       }
     }}
       >
        {({isSubmitting})=>(
          <Form>
          <InputField name="newPassword" label="New Password" placeholder="new password" type="password"/>
          {tokenError ?
          <Flex>
            <Box mr={10} color='red'>{tokenError}</Box>
            <NextLink href='/forgot-password'>
              <Link>resend verification email</Link>
            </NextLink>
          </Flex>
          : null}
          <Button type="submit" mt={4} isLoading={isSubmitting} colorScheme="teal" >Change Password</Button>
          </Form>
        )}
        </Formik>
      </Wrapper>
    );
}



export default  withUrqlClient(createUrqlClient)(ChangePassword);