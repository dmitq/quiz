import { useState } from "react";
import { Input, InputGroup, InputRightElement, Button } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
function PasswordInput(props) {
  const value = props.value;
  const onChange = props.onChange;
  let placeholder;
  props.placeholder
    ? (placeholder = props.placeholder)
    : (placeholder = "Пароль");
  const [show, setShow] = useState(false);
  return (
    <InputGroup>
      <Input
        placeholder={placeholder}
        type={show ? "text" : "password"}
        variant="flushed"
        value={value}
        onChange={onChange}
      />
      <InputRightElement>
        <Button size="md" onClick={() => setShow(!show)} bgColor="transparent">
          {show ? <ViewOffIcon /> : <ViewIcon />}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}

export default PasswordInput;
