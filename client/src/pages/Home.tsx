import { useAuth } from "../contexts/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { AUTH_LINK, GROUPS_LINK } from "../links";
import { VStack, Heading, Button } from "@chakra-ui/react";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <VStack bg="pri.100">
      <Heading color="sec.100">Event Planner</Heading>
      {user ? (
        <Button onClick={() => navigate(GROUPS_LINK())}>
          View your groups
        </Button>
      ) : (
        <Button onClick={() => navigate(AUTH_LINK())}>Login/Sign up</Button>
      )}
    </VStack>
  );
}
