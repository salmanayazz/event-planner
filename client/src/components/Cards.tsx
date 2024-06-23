import { Grid, HStack, Text, VStack, Box, Divider } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import React, { useState } from "react";
import { IconType } from "react-icons";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import ModalInput from "./ModalInput";
import ModalConfirmation from "./ModalConfirmation";

interface CardsProps {
  values: Value[];
  link: (id: number) => string;
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number) => Promise<void>;
}

interface Value {
  id: number;
  name: string;
  icons: {
    type: IconType;
    label: string;
  }[];
}

export default function Cards({ values, link, onDelete, onEdit }: CardsProps) {
  const [deleteValue, setDeleteValue] = useState<Value | undefined>();
  const [editValue, setEditValue] = useState<Value | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      <ModalInput
        // todo
        isOpen={editValue !== undefined}
        onClose={() => setEditValue(undefined)}
        header="Edit Group"
        placeholder="Group Name"
        value={editValue?.name || ""}
        onChange={(e) => {
          if (!editValue) return;
          setEditValue({ ...editValue, name: e.target.value });
        }}
        onSubmit={async () => {
          if (!editValue) return;
          setIsSubmitting(true);
          await onEdit(editValue.id);
          setIsSubmitting(false);
          setEditValue(undefined);
        }}
        isLoading={isSubmitting}
      />
      <ModalConfirmation
        isOpen={deleteValue !== undefined}
        onClose={() => setDeleteValue(undefined)}
        header={`Delete "${deleteValue?.name}"?`}
        onConfirm={async () => {
          if (!deleteValue) return;
          setIsSubmitting(true);
          await onDelete(deleteValue.id);
          setIsSubmitting(false);
          setDeleteValue(undefined);
        }}
        isLoading={isSubmitting}
      />

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
            <HStack justify="space-between" w="100%">
              <Text fontSize="lg" fontWeight="bold" color="sec.100">
                {value.name}
              </Text>

              <HStack spacing="1rem">
                <FiEdit3
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setEditValue(value);
                  }}
                  size="1.25em"
                  color="white"
                />

                <FiTrash2
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDeleteValue(value);
                  }}
                  size="1.25em"
                  color="white"
                />
              </HStack>
            </HStack>

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
