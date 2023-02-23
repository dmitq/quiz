import { Input } from "@chakra-ui/react";
function BasicInput({ value, onChange, placeholder }) {
  return (
    <Input
      required
      display="block"
      type="text"
      placeholder={placeholder}
      variant="flushed"
      value={value}
      onChange={onChange}
    />
  );
}

export default BasicInput;
