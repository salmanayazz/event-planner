import { useAuth } from "../contexts/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { AUTH_LINK, GROUPS_LINK } from "../links";
import { VStack, Heading, Text, Button } from "@chakra-ui/react";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <VStack
      minH="100vh"
      justifyContent="center"
      alignItems="center"
      spacing="2rem"
      p="2rem"
      bg="linear-gradient(190deg, rgb(75, 75, 75), rgb(0, 0, 0))"
    >
      <Heading>Event Planner</Heading>
      <Text fontSize="xl" textAlign="center" maxW="md">
        Welcome to the Event Planner! Vote on locations with your friends and
        make planning events easier.
      </Text>
      {user ? (
        <Button onClick={() => navigate(GROUPS_LINK())}>Go to groups</Button>
      ) : (
        <Button onClick={() => navigate(AUTH_LINK())}>Log in</Button>
      )}
    </VStack>
  );
}
