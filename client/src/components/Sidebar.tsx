import React, { useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  VStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { FaBars } from "react-icons/fa";

interface SidebarProps {
  items: {
    icon: IconType;
    label: string;
    onClick: () => void;
    selected?: boolean;
  }[];
}

export default function Sidebar({ items }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { onToggle } = useDisclosure();

  const handleToggle = () => {
    setIsOpen(!isOpen);
    onToggle();
  };

  return (
    <Box position="relative" zIndex="sticky">
      {/* Element acts as padding when the screen is small */}
      <Box
        display={{ base: "block", md: "none" }}
        width="4rem"
        minWidth="4rem"
        height="100vh"
        position="relative"
        flexShrink={0}
      />
      <Box
        as="nav"
        bg="pri.200"
        color="white"
        width={isOpen ? "13rem" : "4rem"}
        transition="width 0.3s ease"
        height="100vh"
        left="0"
        top="0"
        position={{ base: "fixed", md: "sticky" }}
        boxShadow="lg"
      >
        <Flex direction="column" alignItems="flex-start" p={4}>
          <IconButton
            aria-label="Toggle Sidebar"
            icon={<FaBars />}
            onClick={handleToggle}
            mb={4}
            variant="outline"
            colorScheme="whiteAlpha"
            size="sm"
          />
          <VStack
            spacing={4}
            alignItems={isOpen ? "flex-start" : "center"}
            width="100%"
          >
            {items.map((item, index) => (
              <Flex
                key={index}
                align="center"
                width="100%"
                cursor="pointer"
                onClick={item.onClick}
                p={2}
                _hover={{ bg: "pri.400" }}
                borderRadius="md"
                backgroundColor={item.selected ? "pri.300" : undefined}
                height="2rem"
              >
                <Box as={item.icon} size="1rem" />
                {isOpen && (
                  <Text ml={4} fontSize="md">
                    {item.label}
                  </Text>
                )}
              </Flex>
            ))}
          </VStack>
        </Flex>
      </Box>
    </Box>
  );
}
