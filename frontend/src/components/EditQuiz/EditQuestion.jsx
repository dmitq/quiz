import { Input } from "@chakra-ui/react";
import EditAnswer from "./EditAnswer";
function EditQuestion({ title, answers, register, id }) {
  const fieldName = `questions.${id}`;
  return (
    <>
      <Input
        fontSize="xl"
        variant="flushed"
        margin="10px 0 10px 0"
        defaultValue={title}
        {...register(`${fieldName}.title`)}
      />
      {answers.map((a) => {
        return (
          <EditAnswer
            key={a.id}
            id={a.id}
            fieldName={fieldName}
            register={register}
            title={a.title}
          ></EditAnswer>
        );
      })}
    </>
  );
}

export default EditQuestion;
