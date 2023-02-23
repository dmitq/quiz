import { useState } from "react";
import CreateAnswer from "./CreateAnswer";
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import {
  DeleteIcon,
  QuestionOutlineIcon,
  SmallAddIcon,
} from "@chakra-ui/icons";
function CreateQuestion({ index, register, unregister, removeQuestion }) {
  const [answerIndexes, setAnswerIndexes] = useState([0]);
  const [answerCounter, setAnswerCounter] = useState(1);

  const addAnswer = () => {
    setAnswerIndexes((prevIndexes) => [...prevIndexes, answerCounter]);
    setAnswerCounter((prevCounter) => prevCounter + 1);
  };
  const removeAnswer = (e, index) => {
    setAnswerIndexes((prevIndexes) => [
      ...prevIndexes.filter((item) => item !== index),
    ]);
    unregister(`questions[${index}]`);
  };

  const fieldName = `questions[${index}]`;
  return (
    <Box width="100%" marginBottom="50">
      <fieldset name={fieldName} key={index}>
        <label>
          <InputGroup>
            <Input
              required
              {...register(`${fieldName}.title`, { required: true })}
              variant="flushed"
              placeholder="Введите вопрос"
            />
            <InputLeftElement>
              <QuestionOutlineIcon />
            </InputLeftElement>
            <InputRightElement>
              {index > 0 && (
                <button onClick={(e) => removeQuestion(e, index)}>
                  <DeleteIcon />
                </button>
              )}
            </InputRightElement>
          </InputGroup>
          <br />
          <h2>Ответы</h2>
          {answerIndexes.map((index2) => {
            return (
              <CreateAnswer
                key={index2}
                index={index2}
                fieldName={fieldName}
                register={register}
                removeAnswer={removeAnswer}
              />
            );
          })}
          <button type="button" onClick={addAnswer}>
            <SmallAddIcon fontSize="xl" />
          </button>
        </label>
      </fieldset>
    </Box>
  );
}

export default CreateQuestion;
