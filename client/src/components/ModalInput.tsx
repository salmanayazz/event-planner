import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import StyledInput from "../pages/StyledInput";
import StyledButton from "./StyledButton";
import { useState } from "react";

interface ModalInputProps {
  isOpen: boolean;
  onClose: () => void;
  header: string;
  placeholder: string;
  inputValue?: string;
  onSubmit: (value: string) => Promise<void>;
}

export default function ModalInput({
  isOpen,
  onClose,
  header,
  placeholder,
  inputValue = "",
  onSubmit,
}: ModalInputProps) {
  const [value, setValue] = useState(inputValue);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    setIsLoading(true);
    await onSubmit(value);
    handleClose();
  }

  function handleClose() {
    setIsLoading(false);
    setValue("");
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent backgroundColor="pri.200">
        <ModalHeader color="sec.100">{header}</ModalHeader>
        <ModalCloseButton color="sec.100" />
        <ModalBody>
          <StyledInput
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <StyledButton
            onClick={handleSubmit}
            isLoading={isLoading}
            children={"Confirm"}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
