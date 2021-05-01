import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import router from 'next/router';
import React from 'react'
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { toErrorMap } from '../../utils/toErrorMap';



export const ChangePassword: NextPage<{token: string}> = ({token}) => {
    return (
      <Wrapper>
      <Formik 
      initialValues={{newPassword:""}}
       onSubmit={async (values,{setErrors})=>{
      //  const response = await changePassword(values)
      
      //  if(response.data?.login.errors){
      //     setErrors(toErrorMap(response.data.login.errors)
      //     )
      //  }
      //  else if(response.data?.login.user){
      //   //successfully Registered
      //   router.push('/');
      //  }
     }}
       >
        {({isSubmitting})=>(
          <Form>
            <InputField name="newPassword" label="New Password" placeholder="new password" type="password"/>
          <Button type="submit" mt={4} isLoading={isSubmitting} colorScheme="teal" >Change Password</Button>
          </Form>
        )}
        </Formik>
      </Wrapper>
    );
}

ChangePassword.getInitialProps = ({query}) =>{
  return{
    token: query.token as string
  }
}

export default ChangePassword