import React, { useState } from "react";
import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Text, Box, Button } from "@chakra-ui/react";
import DeleteQuiz from "./DeleteQuiz";
import { UserContext } from "../UserContext";
import { AddIcon } from "@chakra-ui/icons";
function Me() {
  const [error, setError] = useState("");
  const [quizes, setQuizes] = useState([]);
  const [, setToken] = useContext(UserContext);
  useEffect(() => {
    const getMyQuizes = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.LoginToken,
        },
      };
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/quizes`,
        requestOptions
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.detail);
      } else {
        setQuizes(data);
      }
    };
    getMyQuizes();
  }, []);
  const quizPath = (id) => {
    return "/quizes/" + id;
  };

  return (
    <Box padding="12px">
      <Text>Имя на сайте: {localStorage.Name}</Text>
      <Link to={"/"}>
        <Button
          display={["inline", "inline", "none"]}
          size="xs"
          fontSize="md"
          variant="solid"
          colorScheme="red"
          onClick={() => setToken(null)}
        >
          Выйти
        </Button>
      </Link>
      <Box marginTop="10px">
        <Text>Мои тесты:</Text>
        {quizes.map((quiz) => (
          <Box
            key={quiz.id}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            maxWidth="200px"
            m="5px 0 20px 0"
            backgroundColor="twitter.900"
            borderRadius="5px"
          >
            <Link to={quizPath(quiz.id)}>
              <Text fontSize="xl">
                #{quiz.id} {quiz.title}
              </Text>
              <Text>{quiz.description}</Text>
            </Link>
            <DeleteQuiz id={quiz.id} setQuizes={setQuizes}></DeleteQuiz>
          </Box>
        ))}
        <Link to="/create">
          <AddIcon />
        </Link>
      </Box>
    </Box>
  );
}

export default Me;
