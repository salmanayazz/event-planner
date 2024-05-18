import { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  InputRightElement,
  IconButton,
  InputGroup,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useAuth } from "../contexts/auth/AuthContext";

export default function Auth() {
  const { signupUser, loginUser } = useAuth();
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
    if (isLoginMode) {
      await loginUser(email, password);
    } else {
      await signupUser(username, email, password);
    }
  };

  return (
    <Box
      w="100%"
      h="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box p={8} borderRadius="md" boxShadow="xl">
        <Heading mb={6} textAlign="center">
          {isLoginMode ? "Log in" : "Register"}
        </Heading>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement>
              <IconButton
                variant="ghost"
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={handleTogglePasswordVisibility}
                aria-label={""}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button width="full" mt={6} onClick={handleSubmit}>
          {isLoginMode ? "Log in" : "Register"}
        </Button>
        <Button
          variant="link"
          width="full"
          mt={2}
          onClick={handleModeToggle}
          textAlign="center"
        >
          {isLoginMode
            ? "New user? Register here"
            : "Already have an account? Log in"}
        </Button>
      </Box>
    </Box>
  );
}
