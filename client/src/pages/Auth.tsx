import { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Button,
  Heading,
  InputRightElement,
  InputGroup,
  VStack,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useAuth } from "../contexts/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { GROUPS_LINK } from "../links";
import StyledInput from "../components/StyledInput";
import StyledButton from "../components/StyledButton";

export default function Auth() {
  const { signupUser, loginUser } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleModeToggle = () => {
    setIsLoginMode(!isLoginMode);
  };

  const handleSubmit = async () => {
    let result = false;
    if (isLoginMode) {
      result = await loginUser(email, password);
    } else {
      result = await signupUser(username, email, password);
    }

    if (result) {
      navigate(GROUPS_LINK());
    }
  };

  return (
    <Box
      w="100%"
      h="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="pri.100"
    >
      <VStack w="25rem" p="2rem" borderRadius="md" bg="pri.200" spacing="1rem">
        <Heading mb="1rem" textAlign="center" color="sec.100">
          {isLoginMode ? "Log in" : "Register"}
        </Heading>

        {!isLoginMode && (
          <FormControl>
            <FormLabel color="sec.200">Username</FormLabel>
            <StyledInput
              placeholder="Enter your username (3 - 20 characters)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
        )}

        <FormControl>
          <FormLabel color="sec.200">Email</FormLabel>
          <StyledInput
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel color="sec.200">Password</FormLabel>
          <InputGroup>
            <StyledInput
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password (6 - 40 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement>
              <Button
                variant="ghost"
                onClick={handleTogglePasswordVisibility}
                aria-label={""}
                _hover={{ bg: "transparent" }}
                color="sec.200"
              >
                {showPassword ? <ViewOffIcon /> : <ViewIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <VStack w="100%" mt="1rem">
          <StyledButton
            onClick={handleSubmit}
            isLoading={false}
            children={isLoginMode ? "Log in" : "Register"}
            width="full"
          />

          <Button
            variant="link"
            width="full"
            mt={2}
            onClick={handleModeToggle}
            textAlign="center"
            color="sec.200"
          >
            {isLoginMode
              ? "New user? Register here"
              : "Already have an account? Log in"}
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}
