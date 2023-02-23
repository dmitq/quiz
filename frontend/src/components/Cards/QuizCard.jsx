import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Text } from '@chakra-ui/react'
function QuizCard(props) {
  return (
    <Box position="absolute" top="250" width="100%">
    { props.title &&
        <Link to={"quizes/"+props.id}>
        <Text fontSize="2xl">"{props.title}"</Text>
        <Text>{props.description}</Text>
        <Text>Автор: {props.author_name}</Text>
        </Link>
    }
    </Box>
  )
}

export default QuizCard
