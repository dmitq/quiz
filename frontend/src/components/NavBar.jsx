import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Box, Button, Stack } from "@chakra-ui/react";

function NavBar() {
  const [token, setToken, login] = useContext(UserContext);
  const handleLogout = () => {
    setToken(null);
  };
  return (
    <nav>
      <Box
        display="flex"
        alignItems="center"
        padding="12px"
        justifyContent="space-between"
      >
        <Box display="flex" gap="10px">
          <Link to="/">
            <Button size="md" variant="link">
              Quiz
            </Button>
          </Link>
        </Box>
        <Box justifySelf={["end", "start"]} position="relative">
          <Link to="create">
            <Button
              variant="outline"
              colorScheme="twitter"
              size="sm"
              fontSize="md"
            >
              Создать квиз
            </Button>
          </Link>
        </Box>
        <Box display="flex" gap={["none", "none", "10px"]}>
          {!token && (
            <Link to={"/login"}>
              <Button variant="solid">Войти</Button>
            </Link>
          )}
          {token && (
            <>
              <Link to="/me">
                <Button size="md" variant="link">
                  {login}
                </Button>
              </Link>
              <Link to={"/"}>
                <Button
                  display={["none", "none", "inline-block"]}
                  size="md"
                  variant="link"
                  onClick={handleLogout}
                >
                  Выйти
                </Button>
              </Link>
            </>
          )}
        </Box>
      </Box>
    </nav>
  );
}

export default NavBar;
