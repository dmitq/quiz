import { Box } from "@chakra-ui/react";
export default function CenterBox({ children }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap="1rem"
      maxW={["90%", "70%", "30rem"]}
      m="2rem auto"
    >
      {children}
    </Box>
  );
}
