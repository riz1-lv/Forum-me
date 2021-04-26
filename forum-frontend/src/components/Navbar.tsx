import { Box } from '@chakra-ui/layout';
import { Button, Flex, Link } from '@chakra-ui/react';
import React from 'react'
import NextLink from 'next/link'
import { useMeQuery } from '../generated/graphql';

interface NavbarProps {

}

export const Navbar: React.FC<NavbarProps> = ({}) => {

  const [{data,fetching}] = useMeQuery()
  let body = null;
  if(fetching){

  }
  else if(!data?.me){
     body=(
     <>
  <NextLink href='/login'>
    <Link color="white" mr={2}>Login</Link>
  </NextLink>
  <NextLink href='/register'>
    <Link color="white">Register</Link>
  </NextLink>
  </>)
  }
  else{
    body=(<Flex>
            <Box mr={2}>{data.me.username}</Box>
            <Button variant='link'>Logout</Button>
        </Flex>)
  }
    return (
      <Flex bg ='tomato' p={4}>{}
          <Box ml={"auto"}>
            {body}
            
          </Box>
      </Flex>
    );
}