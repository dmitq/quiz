import { useState, useMemo } from "react";
import { Box, Input, Text } from "@chakra-ui/react";
function AnswerCard({ title, id, q_id, register, getValues, setValue }) {
  const [checked, setChecked] = useState(false);
  const color = useMemo(
    () => (getValues(`${q_id}.${title}`) ? "blue.400" : "whiteAlpha.100"),
    [checked]
  );
  const onClick = () => {
    setValue(`${q_id}.${title}`, !checked);
    setChecked(!checked);
  };
  return (
    <Box
      onClick={onClick}
      width="100%"
      minH="10vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      border="2px black"
      borderRadius="7px"
      backgroundColor={color}
    >
      <Input
        type="checkbox"
        {...register(`${q_id}.${title}`)}
        display="none"
      ></Input>
      <Text maxW="100%" fontSize="2xl">
        {title}
      </Text>
    </Box>
  );
}

export default AnswerCard;
