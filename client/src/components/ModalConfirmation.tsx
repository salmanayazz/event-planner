import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

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
          <Button
            backgroundColor="sec.100"
            color="pri.100"
            onClick={onConfirm}
            isLoading={isLoading}
            _hover={{ backgroundColor: "sec.200" }}
            _active={{ backgroundColor: "sec.300" }}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
