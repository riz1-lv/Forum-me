import { Box } from '@chakra-ui/layout';
import { Flex, Link } from '@chakra-ui/react';
import React from 'react'

interface NavbarProps {

}

export const Navbar: React.FC<NavbarProps> = ({}) => {
    return (
      <Flex bg ='tomato' p={4}>
          <Box ml={"auto"}>
          <Link color="white" mr={2}>login</Link>
          <Link color="white">register</Link>
          pretty good
        </Box>
      </Flex>
    );
}