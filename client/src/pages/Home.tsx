import { useAuth } from "../contexts/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { AUTH_LINK, GROUPS_LINK } from "../links";
import { VStack, Heading, Text } from "@chakra-ui/react";
import StyledButton from "../components/StyledButton";

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
      <Heading color="sec.100">Event Planner</Heading>
      <Text fontSize="xl" textAlign="center" maxW="md" color="sec.200">
        Welcome to the Event Planner! Vote on locations with your friends and
        make planning events easier.
      </Text>
      {user ? (
        <StyledButton onClick={() => navigate(GROUPS_LINK())}>
          Go to groups
        </StyledButton>
      ) : (
        <StyledButton onClick={() => navigate(AUTH_LINK())}>
          Log in
        </StyledButton>
      )}
    </VStack>
  );
}
