import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./UserContext";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import theme from "./theme";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <UserProvider>
          <App />
        </UserProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
