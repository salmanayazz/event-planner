import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
} from "@chakra-ui/react";
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
      <ModalContent>
        <ModalHeader>{header}</ModalHeader>
        <ModalCloseButton />

        <ModalFooter>
          <Button
            onClick={handleConfirm}
            isLoading={isLoading}
            children={"Confirm"}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
