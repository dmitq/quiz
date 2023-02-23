import { useState } from 'react'
import {Navigate} from 'react-router-dom';
import { UserContext } from '../../UserContext';
import { useContext } from 'react';
import { useForm } from "react-hook-form";
import CreateQuestion from './CreateQuestion';
import { Button, Text, Textarea, useToast } from '@chakra-ui/react';
import BasicInput from '../Inputs/BasicInput';
import CenterBox from '../CenterBox';
import { AddIcon } from '@chakra-ui/icons';
import SubmitButton from '../Buttons/SubmitButton';

function CreateQuiz() {
  const [token, ] = useContext(UserContext)
  const { register, handleSubmit, unregister} = useForm()
  const [isLoading, setIsloading] = useState(false)
  const [indexes1, setIndexes1] = useState([0,])
  const [counter1, setCounter1] = useState(1)

  const [title, setTitle] = useState("")
  const [bio, setBio] = useState("")
  const [quizId, setQuizId] = useState("")
  const [error, setError] = useState("")
  const toast = useToast()
  const submitQuiz = async (qa) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({title: title, description: bio, questions: qa}),
    }
    setIsloading(true)
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/quizes`, requestOptions)
    const data = await response.json();
    if (!response.ok) {
      setError(data.detail);
    } else {
      setIsloading(false)
      setError("")
      setQuizId(data.id)
      toast({
        title: `Квиз создан! Код - ${data.id}`,
        status: "success",
        position: "bottom-left",
      });
      }
  }

  const onSubmit = (qa) => {
    if (!title) {
      setError("Название обязательно")
    }
    else {
      qa = qa.questions

      submitQuiz(qa)
    }
  }
  const addQuestion = () => {
    setIndexes1(prevIndexes => [...prevIndexes, counter1])
    setCounter1(prevCounter => prevCounter+1)
  }
  const removeQuestion = (e, index) => {
    setIndexes1(prevIndexes => [...prevIndexes.filter(item => item !== index)]);
    unregister(`questions[${index}]`)
  }
  if (!token) {
    return <Navigate to="/login"></Navigate>
  }
  if (quizId) {return <Navigate to="/" />}

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)}>
      <CenterBox maxW="50%">
      <BasicInput placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)}></BasicInput>
      <Textarea variant="unstyled" placeholder="Описание" value={bio} onChange={(e) => setBio(e.target.value)}></Textarea>
      <Text fontSize="2xl">Вопросы: </Text>

      {indexes1.map(index => {
        return (
        <CreateQuestion key={index} index={index} register={register} unregister={unregister} removeQuestion={removeQuestion}/>
        )
      })}
      <Button onClick={addQuestion}>
        <AddIcon/>
      </Button>
      <SubmitButton isLoading={isLoading}>Отправить</SubmitButton>
    </CenterBox>
    </form>
    </>

  )
}

export default CreateQuiz
