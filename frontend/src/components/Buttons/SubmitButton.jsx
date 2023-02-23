import { Button } from "@chakra-ui/react";

function SubmitButton({ isLoading, children }) {
  return (
    <Button
      type="submit"
      colorScheme="green"
      isLoading={isLoading}
      loadingText="Отправка..."
    >
      {children}
    </Button>
  );
}

export default SubmitButton;
