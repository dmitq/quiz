import React, { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import PasswordInput from "./Inputs/PasswordInput";
import BasicInput from "./Inputs/BasicInput";
import { Text, Button } from "@chakra-ui/react";
import CenterBox from "./CenterBox";

function Register() {
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [, setToken] = useContext(UserContext);
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const submitRegister = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        login: login,
        name: name,
        hashed_password: password,
      }),
    };
    setLoading(true);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users`,
      requestOptions
    );
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      toast({
        title: "Пользователь с таким логином уже существует",
        status: "error",
        position: "bottom-left",
      });
    } else {
      setToken(data.access_token);
      toast({
        title: "Вы вошли в учетную запись",
        status: "success",
        position: "bottom-left",
      });
      setValid(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmationPassword) {
      toast({
        title: "Пароль должен совпадать",
        status: "error",
        position: "bottom-left",
      });
    } else if (password.length < 4) {
      toast({
        title: "Длина пароля не менее 4 символов",
        status: "error",
        position: "bottom-left",
      });
    } else {
      submitRegister();
    }
  };
  if (valid) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <CenterBox>
          <Text fontSize="xl">Новая учетная запись</Text>
          <BasicInput
            placeholder="Имя"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          ></BasicInput>
          <BasicInput
            placeholder="Логин"
            value={login}
            onChange={(e) => {
              setLogin(e.target.value);
            }}
          ></BasicInput>
          <PasswordInput
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <PasswordInput
            placeholder="Подтвердите пароль"
            value={confirmationPassword}
            onChange={(e) => {
              setConfirmationPassword(e.target.value);
            }}
          />
          <Button
            isLoading={loading}
            width="100%"
            type="submit"
            colorScheme="whatsapp"
          >
            Создать
          </Button>
        </CenterBox>
      </form>
    </>
  );
}

export default Register;
