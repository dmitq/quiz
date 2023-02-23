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
import { DeleteIcon } from "@chakra-ui/icons";
function DeleteQuiz({ id, setQuizes }) {
  const deleteQuiz = async () => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.LoginToken,
      },
    };
    await fetch(
      `${import.meta.env.VITE_API_URL}/api/quizes/${id}`,
      requestOptions
    );
    setQuizes((prevQuizes) => [...prevQuizes.filter((q) => q.id !== id)]);
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const handleDelete = () => {
    onClose();
    deleteQuiz();
  };
  return (
    <>
      <Button
        variant="unstyled"
        onClick={onOpen}
        display="inline-block"
        marginRight="5px"
      >
        <DeleteIcon boxSize={6} />
      </Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Удалить квиз
            </AlertDialogHeader>

            <AlertDialogBody>
              Вы уверены? Отменить действие будет невозможно.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Отменить
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Удалить
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default DeleteQuiz;
