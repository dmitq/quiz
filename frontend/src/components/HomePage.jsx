import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import BasicInput from "./Inputs/BasicInput";
import {
  Skeleton,
  Stack
} from "@chakra-ui/react";
import QuizCard from "./Cards/QuizCard";

function HomePage() {
  const [quiz, setQuiz] = useState();
  const [gameCode, setGameCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    setError("");
    const fetchQuizBio = async () => {
      const requestOptions = {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      };
      if (gameCode) {
        setIsLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/quizes/bio/${gameCode}`,
          requestOptions
        );
        const data = await response.json();
        if (response.ok) {
          setQuiz(data);
          setIsLoading(false);
        } else {
          setError("Не найден");
          setIsLoading(false);
        }
      }
    };
    fetchQuizBio();
  }, [gameCode]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap="1rem"
      maxW={{ sm: "100% ", md: "80%", lg: "40%" }}
      m="8rem auto 50vh auto"
      padding="12px"
    >
      <BasicInput
        value={gameCode}
        placeholder="Код теста"
        onChange={(e) => setGameCode(e.target.value)}
      />
      <Stack height="60px" width="100%">
        <Skeleton isLoaded={!isLoading}>
          {error ? error : <QuizCard {...quiz}></QuizCard>}
        </Skeleton>
      </Stack>
    </Box>
  );
}

export default HomePage;
