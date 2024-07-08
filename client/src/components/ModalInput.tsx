import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
  Input,
} from "@chakra-ui/react";
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
      <ModalContent>
        <ModalHeader>{header}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={handleSubmit}
            isLoading={isLoading}
            children={"Confirm"}
            isDisabled={value == ""}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
