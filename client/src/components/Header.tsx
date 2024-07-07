import React, { useState, useEffect } from "react";
import { Box, Flex, Heading, Button } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface HeaderProps {
  title: string;
  buttonIcon: IconType;
  buttonLabel: string;
  onButtonClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  buttonIcon,
  buttonLabel,
  onButtonClick,
}) => {
  const [scrollMultiplier, setScrollMultiplier] = useState(2);

  useEffect(() => {
    const handleScroll = () => {
      setScrollMultiplier(Math.max(2 - window.scrollY / 100, 1));
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      width="100%"
      bg="pri.200"
      height={`calc(5rem * ${scrollMultiplier})`}
      zIndex="1"
    >
      <Flex align="center" justify="space-between" height="100%" paddingX={4}>
        <Heading as="h1" fontSize={`${1.5 * scrollMultiplier}rem`}>
          {title}
        </Heading>
        <Button
          aria-label="Action Button"
          onClick={onButtonClick}
          color={scrollMultiplier == 1 ? "sec.100" : "pri.200"}
          variant={scrollMultiplier == 1 ? "outline" : "solid"}
          leftIcon={React.createElement(buttonIcon)}
        >
          {buttonLabel}
        </Button>
      </Flex>
    </Box>
  );
};

export default Header;
