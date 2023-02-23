import {
  Checkbox,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  InputLeftElement,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

function CreateAnswer({ fieldName, index, register, removeAnswer }) {
  const fieldName2 = `${fieldName}.answers[${index}]`;
  return (
    <fieldset name={fieldName2} key={index}>
      <label>
        <InputGroup>
          <Input
            required
            {...register(`${fieldName2}.title`, { required: true })}
            variant="filled"
            placeholder="Введите ответ"
          />
          <InputLeftElement>
            <Checkbox
              size="lg"
              type="checkbox"
              {...register(`${fieldName2}.is_correct`)}
            />
          </InputLeftElement>
          {index > 0 && (
            <InputRightElement>
              <Button variant="ghost" onClick={(e) => removeAnswer(e, index)}>
                <DeleteIcon />
              </Button>
            </InputRightElement>
          )}
        </InputGroup>
      </label>
    </fieldset>
  );
}

export default CreateAnswer;
