import { Text } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { Input, useToast } from "@chakra-ui/react";
import { UserContext } from "../../UserContext";
import CenterBox from "../CenterBox";
import SubmitButton from "../Buttons/SubmitButton";
import { useForm } from "react-hook-form";
import EditQuestion from "./EditQuestion";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@chakra-ui/react";
function EditQuiz() {
  const [token] = useContext(UserContext);

  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, unregister} = useForm()
  const quiz_id = useParams().quiz_id;
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [questions, setQuestions] = useState([]);
  const toast = useToast()
  const navigate = useNavigate();
  useEffect(() => {
    const fetchQuiz = async () => {
      const requestOptions = {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/quizes/edit/quiz_id`,
        requestOptions
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.detail);
        setLoading(false);
        toast({
          title: "Нет прав на редактирование",
          status: "error",
          position: "bottom-left",
        });
        navigate(`/quizes/${quiz_id}`)
      } else {
        setTitle(data.title);
        setBio(data.description)
        setQuestions(data.questions);
        setLoading(false);
      }
    };
    fetchQuiz();
  }, []);
  const deleteNulls = (obj) => {
    obj["questions"] = obj["questions"].filter(elem => !!elem)
    for (const [key, value] of Object.entries(obj["questions"])) {
      obj["questions"][key]["answers"] = obj["questions"][key]["answers"].filter(elem => !!elem)
    }
  }

  const submitQuiz = async (qa) => {
    deleteNulls(qa)
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ title: title, description: bio, ...qa }),
    };
    setLoading(true);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/quizes/quiz_id`,
      requestOptions
    );
    const data = await response.json();
    if (!response.ok) {
      setError(data.detail);
    } else {
      setLoading(false);
      setError("");
      toast({
        title: `Квиз обновлен`,
        status: "success",
        position: "bottom-left",
      });
    }
  };
  const onSubmit = (qa) => {
      submitQuiz(qa)
  }
  return (
    <CenterBox>
      {
      loading ? <Spinner/> :
      <form onSubmit={handleSubmit(onSubmit)}>
        <CenterBox>
        <Text fontSize="2xl">Название</Text>
        <Input value={title} onChange={(e) => setTitle(e.target.value)}></Input>
        <Text fontSize="2xl">Описание</Text>
        <Input value={bio} onChange={(e) => setBio(e.target.value)}></Input>
        <Text fontSize="2xl">Вопросы: </Text>
        {questions.map((q) =>
          <EditQuestion key={q.id} id={q.id} register={register} title={q.title} answers={q.answers}></EditQuestion>

          )}
        <SubmitButton>Обновить</SubmitButton>
        </CenterBox>
      </form>
      }
    </CenterBox>
  );
}

export default EditQuiz;
