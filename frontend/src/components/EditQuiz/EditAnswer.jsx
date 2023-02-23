import {
  Input,
  InputGroup,
  InputLeftElement,
  Checkbox,
} from "@chakra-ui/react";
function EditAnswer({ title, register, fieldName, id }) {
  return (
    <InputGroup>
      <Input
        fontSize="xl"
        {...register(`${fieldName}.answers.${id}.title`)}
        defaultValue={title}
        maxW="90%"
        marginLeft="10%"
      />
      <InputLeftElement>
        <Checkbox
          size="lg"
          type="checkbox"
          {...register(`${fieldName}.answers.${id}.is_correct`)}
        />
      </InputLeftElement>
    </InputGroup>
  );
}

export default EditAnswer;
