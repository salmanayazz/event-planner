import { Grid, HStack, Text, VStack, Box, Divider } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import React from "react";
import { IconType } from "react-icons";

interface CardsProps {
  values: Value[];
  link: (id: number) => string;
}

interface Value {
  id: number;
  name: string;
  icons: {
    type: IconType;
    label: string;
  }[];
}

export default function Cards({ values, link }: CardsProps) {
  return (
    <Grid
      templateColumns={{
        base: "repeat(1, 1fr)",
        md: "repeat(2, 1fr)",
        lg: "repeat(3, 1fr)",
      }}
      gap={4}
      p={4}
      justifyContent="center"
      backgroundColor="pri.100"
      width="100%"
      height="100%"
    >
      {values.map((value) => (
        <NavLink key={value.id} to={link(value.id)}>
          <VStack
            bg="pri.200"
            p={4}
            borderRadius="md"
            w="100%"
            align="start"
            spacing="1.5rem"
          >
            <Text fontSize="lg" fontWeight="bold" color="sec.100">
              {value.name}
            </Text>

            <Divider color="sec.200" />

            <HStack spacing="2rem">
              {value.icons.map((icon) => (
                <Box position="relative" key={`${value.id} ${icon.type}`}>
                  {React.createElement(icon.type, {
                    size: "1.25em",
                    color: "white",
                  })}
                  <Text
                    position="absolute"
                    top="-0.5em"
                    // shift label based on length
                    right={`${
                      -1.5 + icon.label.length.toString().length * 0.15
                    }rem`}
                    color="white"
                    bg="pri.400"
                    borderRadius="full"
                    px={2}
                    fontSize="xs"
                    fontWeight="bold"
                  >
                    {icon.label}
                  </Text>
                </Box>
              ))}
            </HStack>
          </VStack>
        </NavLink>
      ))}
    </Grid>
  );
}
