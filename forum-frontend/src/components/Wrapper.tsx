import { Box } from '@chakra-ui/react'
import React from 'react'

interface WrapperProps {
    size?: 'small' | 'regular';
}

export const Wrapper: React.FC<WrapperProps> = ({children, size="small"}) => {
    return <Box mt={8} maxW={size === "regular" ? "800px": "400px"} w="100%" mx="auto">
    {children}
  </Box>
}
