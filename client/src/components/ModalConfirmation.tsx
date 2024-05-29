import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import StyledButton from "./StyledButton";

interface ModalInputProps {
  isOpen: boolean;
  onClose: () => void;
  header: string;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function ModalInput({
  isOpen,
  onClose,
  header,
  onConfirm,
  isLoading,
}: ModalInputProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent backgroundColor="pri.200">
        <ModalHeader color="sec.100">{header}</ModalHeader>
        <ModalCloseButton color="sec.100" />

        <ModalFooter>
          <StyledButton
            onClick={onConfirm}
            isLoading={isLoading}
            children={"Confirm"}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
