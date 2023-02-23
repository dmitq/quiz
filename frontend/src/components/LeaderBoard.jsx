import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Text } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import convertUTCDateToLocalDate from "../convertUTCDateToLocalDate";
function LeaderBoard({ mobile }) {
  const quiz_id = useParams().quiz_id;
  const [leaderboard, setLeaderboard] = useState([]);
  const fetchLeaderboard = async () => {
    const requestOptions = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/quizes/${quiz_id}/leaderboard`,
      requestOptions
    );
    const data = await response.json();
    setLeaderboard(data);
  };
  useEffect(() => {
    fetchLeaderboard();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 10000);
    setTimeout(() => clearInterval(interval), 40000);
  }, []);
  return (
    <TableContainer
      textAlign="center"
      maxW="40rem"
      display={!mobile && ["none", "none", "none", "block", "block"]}
    >
      <Text fontSize="2xl">Таблица лидеров</Text>
      <Table variant="striped" size="sm">
        <Thead>
          <Tr>
            <Th>имя</Th>
            <Th>правильных</Th>
            <Th>дата отправки</Th>
          </Tr>
        </Thead>
        <Tbody>
          {leaderboard.map((leader, index) => (
            <Tr key={index}>
              {leader.user_name == localStorage["Name"] ? (
                <Td color="blue.300">{leader.user_name} (я)</Td>
              ) : (
                <Td>{leader.user_name}</Td>
              )}
              <Td textAlign="center">{leader.score}</Td>
              <Td>{convertUTCDateToLocalDate(new Date(leader.date))}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default LeaderBoard;
