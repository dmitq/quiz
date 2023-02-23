import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem("LoginToken"));
  const [login, setLogin] = useState();
  const [id, setId] = useState();
  useEffect(() => {
    const fetchUser = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/me`,
        requestOptions
      );
      const data = await response.json();
      if (!response.ok) {
        setToken(null);
      }
      localStorage.setItem("LoginToken", token);
      localStorage.setItem("Name", data.name);
      localStorage.setItem("Id", data.id);
      setLogin(data.login);
      setId(data.id);
    };
    fetchUser();
  }, [token]);

  return (
    <UserContext.Provider value={[token, setToken, login, id]}>
      {props.children}
    </UserContext.Provider>
  );
};
