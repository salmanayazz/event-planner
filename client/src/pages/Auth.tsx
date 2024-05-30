import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Button,
  Heading,
  InputRightElement,
  InputGroup,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { AuthError, useAuth } from "../contexts/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { GROUPS_LINK } from "../links";
import StyledInput from "../components/StyledInput";
import StyledButton from "../components/StyledButton";

export default function Auth() {
  const { registerUser, loginUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | undefined>();

  useEffect(() => {
    if (error?.message) {
      toast({
        title: "An error occurred",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleModeToggle = () => {
    setIsLoginMode(!isLoginMode);
  };

  const handleSubmit = async () => {
    setError(undefined);
    // if not in login mode, validate credentials locally
    if (!validateCredentials()) {
      return;
    }

    let authError: AuthError | undefined;
    setIsLoading(true);
    if (isLoginMode) {
      authError = await loginUser(email, password);
    } else {
      authError = await registerUser(username, email, password);
    }
    setIsLoading(false);
    console.log(authError);

    if (authError == undefined) {
      navigate(GROUPS_LINK());
    }

    setError(authError);
  };

  const validateCredentials = () => {
    const error: AuthError = {
      username: undefined,
      email: undefined,
      password: undefined,
      message: undefined,
    };

    if (!isLoginMode) {
      if (username.length < 3 || username.length > 20) {
        error.username = "Username must be between 3 and 20 characters";
      }
    }

    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
      error.email = "Invalid email";
    }

    if (password.length < 6 || password.length > 40) {
      error.password = "Password must be between 6 and 40 characters";
    }

    setError(error);

    return !(
      error?.email ||
      error?.password ||
      error?.username ||
      error?.message
    );
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
      <VStack
        w="28rem"
        p="2.5rem"
        borderRadius="md"
        bg="pri.200"
        spacing="0.75rem"
      >
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
              isInvalid={error?.username != undefined}
            />

            <FormLabel color="red.200">{error?.username}</FormLabel>
          </FormControl>
        )}

        <FormControl>
          <FormLabel color="sec.200">Email</FormLabel>
          <StyledInput
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isInvalid={error?.email != undefined}
          />

          <FormLabel color="red.200">{error?.email}</FormLabel>
        </FormControl>

        <FormControl>
          <FormLabel color="sec.200">Password</FormLabel>
          <InputGroup>
            <StyledInput
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password (6 - 40 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={error?.password != undefined}
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

          <FormLabel color="red.200">{error?.password}</FormLabel>
        </FormControl>

        <VStack w="100%" mt="1rem">
          <StyledButton
            onClick={handleSubmit}
            children={isLoginMode ? "Log in" : "Register"}
            width="full"
            isLoading={isLoading}
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
