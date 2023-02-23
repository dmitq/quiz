import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Text, Button, Box, Stack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { ArrowForwardIcon, ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import CenterBox from "./CenterBox";
import AnswerCard from "./Cards/AnswerCard";
import SubmitAnswers from "./SubmitQuiz";
import LeaderBoard from "./LeaderBoard";
import { useForm } from "react-hook-form";
function QuizPage() {
  const quiz_id = useParams().quiz_id;
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quiz, setQuiz] = useState();
  const [results, setResults] = useState();
  const [submit, setSubmit] = useState(false);
  const { register, handleSubmit, getValues, setValue } = useForm();
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async (quiz_id) => {
      const requestOptions = {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/quizes/${quiz_id}`,
        requestOptions
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.detail);
      } else {
        setQuiz(data);
        if (data.questions.length == 1) {
          setSubmit(true);
        }
      }
      setLoading(false);
    };
    fetchQuiz(quiz_id);
  }, []);

  const handleNext = () => {
    if (index + 1 < quiz.questions.length) {
      setIndex(index + 1);
      if (index + 1 >= quiz.questions.length - 1) {
        setSubmit(true);
      }
    }
  };
  const handlePrev = () => {
    if (index - 1 >= 0) {
      setIndex(index - 1);
    }
  };
  const onSubmit = (ans) => {
    sendAnswers(ans);
    return <Link to="./results"></Link>;
  };
  const sendAnswers = async (answers) => {
    setLoading(true);
    let name = "Anonymous";
    if (localStorage.getItem("Name") !== "undefined") {
      name = localStorage.getItem("Name");
    }
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answers: answers, name: name }),
    };
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/check_answers`,
      requestOptions
    );
    const data = await response.json();
    if (!response.ok) {
      setError(data.detail);
    } else {
      setResults(data);
      setScore((data[1] / Object.entries(data[0]).length) * 100);
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <CenterBox>
        <Spinner></Spinner>
      </CenterBox>
    );
  }
  const color = (score) => {
    if (score >= 75) return "green.400";
    if (score >= 50) return "orange.300";
    return "red.500";
  };
  if (error) {
    return <Text>{error}</Text>;
  }
  if (results) {
    return (
      <>
        <Box textAlign="center">
          <Text fontSize="4xl" marginTop="50px">
            Результаты:{" "}
            <Text as="span" color={() => color(score)}>
              {score}%
            </Text>
          </Text>
          <Text fontSize="xl">
            Правильных ответов: {results[1]} из{" "}
            {Object.entries(results[0]).length}
          </Text>
          <Link to="./leaderboard">
            <Button marginTop="10px">Таблица лидеров</Button>
          </Link>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          gap={10}
          padding={["12px", "40px", "50px"]}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap="1rem"
            width={["100rem", "60rem", "50rem", "30rem", "40rem"]}
          >
            {Object.entries(results[0]).map((q, index) => {
              const user_answers = Object.entries(q[1].user_answers);
              const real_answers = Object.entries(q[1].real_answers);
              return (
                <Stack
                  key={index}
                  width="100%"
                  margin="20px 0 20px 0"
                  alignItems="center"
                >
                  <Text fontSize="3xl">{q[0]}</Text>

                  {user_answers.map((a, index) => {
                    let color = a[1] ? "red.500" : "whiteAlpha.100";
                    if (a[1] && real_answers[index][1]) {
                      color = "green.400";
                    }
                    return (
                      <Box
                        key={index}
                        width="100%"
                        minH="10vh"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        border="2px black"
                        borderRadius="7px"
                        backgroundColor={color}
                        margin="0"
                      >
                        <Text fontSize="xl">{a[0]}</Text>
                      </Box>
                    );
                  })}

                  <Text fontSize="2xl">Правильный ответ: </Text>
                  {real_answers.map((a, index) => {
                    return (
                      <Box
                        key={index}
                        width="100%"
                        minH="10vh"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        border="2px black"
                        borderRadius="7px"
                        backgroundColor={a[1] ? "green.400" : "whiteAlpha.100"}
                      >
                        <Text fontSize="xl">{a[0]}</Text>
                      </Box>
                    );
                  })}
                </Stack>
              );
            })}
          </Box>
          <LeaderBoard quiz_id={quiz_id} marginTop="20px" />
        </Box>
      </>
    );
  }
  return (
    <CenterBox>
      <Box textAlign="center">
        <Text fontSize="4xl">{quiz.title}</Text>
        <Text>{quiz.description}</Text>
        <Text>{quiz.date_created}</Text>
        {localStorage.getItem("Id") == quiz.author_id && (
          <Link to="./edit">
            <Button variant="ghost">
              <EditIcon />
            </Button>
          </Link>
        )}
      </Box>
      <Stack direction="row" justifyContent="space-between" width="10rem">
        <Button variant="outline" fontSize="3xl" onClick={() => handlePrev()}>
          <ArrowBackIcon />
        </Button>
        <Button variant="outline" fontSize="3xl" onClick={() => handleNext()}>
          <ArrowForwardIcon />
        </Button>
      </Stack>
      <Text fontSize="3xl">{quiz.questions[index].title}</Text>
      {quiz.questions[index].answers.map((a) => (
        <AnswerCard
          register={register}
          key={a.id}
          title={a.title}
          id={a.id}
          q_id={quiz.questions[index].id}
          getValues={getValues}
          setValue={setValue}
        ></AnswerCard>
      ))}
      {submit && <SubmitAnswers submit={handleSubmit(onSubmit)} />}
    </CenterBox>
  );
}
export default QuizPage;
