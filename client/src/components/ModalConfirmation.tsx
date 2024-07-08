import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import StyledButton from "./StyledButton";
import { useState } from "react";

interface ModalInputProps {
  isOpen: boolean;
  onClose: () => void;
  header: string;
  onConfirm: () => Promise<void>;
}

export default function ModalInput({
  isOpen,
  onClose,
  header,
  onConfirm,
}: ModalInputProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleConfirm() {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent backgroundColor="pri.200">
        <ModalHeader color="sec.100">{header}</ModalHeader>
        <ModalCloseButton color="sec.100" />

        <ModalFooter>
          <StyledButton
            onClick={handleConfirm}
            isLoading={isLoading}
            children={"Confirm"}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
