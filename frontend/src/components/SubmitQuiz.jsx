import React from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { Button, useDisclosure } from "@chakra-ui/react";
function SubmitAnswers({ submit }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const Submit = () => {
    submit();
    onClose();
  };
  const handleCancel = () => {
    onClose();
  };
  return (
    <>
      <Button colorScheme="twitter" onClick={onOpen} display="inline-block">
        Завершить
      </Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Отправить на проверку
            </AlertDialogHeader>

            <AlertDialogBody>Вы хотите завершить выполнение?</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCancel}>
                Отменить
              </Button>
              <Button type="submit" colorScheme="green" onClick={Submit} ml={3}>
                Завершить
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default SubmitAnswers;
