import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useToast, Text, Button } from "@chakra-ui/react";
import BasicInput from "./Inputs/BasicInput";
import PasswordInput from "./Inputs/PasswordInput";
import CenterBox from "./CenterBox";

function Register() {
  const [, setToken] = useContext(UserContext);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const submitLogin = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: JSON.stringify(
        `grant_type=&username=${login}&password=${password}&scope=&client_id=&client_secret=`
      ),
    };
    setLoading(true)
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/token`,
      requestOptions
    );
    const data = await response.json();
    setLoading(false)
    if (!response.ok) {
      toast({
        title: "Неверный логин или пароль",
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
    submitLogin();
  };
  if (valid) {
    return <Navigate to="/" />;
  }
  return (
    <form onSubmit={handleSubmit}>
      <CenterBox maxW="40%">
        <Text fontSize="xl">Вход</Text>
        <BasicInput
          placeholder="Логин"
          value={login}
          onChange={(e) => {
            setLogin(e.target.value);
          }}
        />
        <PasswordInput
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Button
          isLoading={loading}
          width="100%"
          type="submit"
          colorScheme="whatsapp"
        >
          Войти
        </Button>
        <Link to="/register">Нет учетной записи?</Link>
      </CenterBox>
    </form>
  );
}

export default Register;
