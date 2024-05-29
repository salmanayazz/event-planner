import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import StyledInput from "./StyledInput";
import StyledButton from "./StyledButton";

interface ModalInputProps {
  isOpen: boolean;
  onClose: () => void;
  header: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function ModalInput({
  isOpen,
  onClose,
  header,
  placeholder,
  value,
  onChange,
  onSubmit,
  isLoading,
}: ModalInputProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent backgroundColor="pri.200">
        <ModalHeader color="sec.100">{header}</ModalHeader>
        <ModalCloseButton color="sec.100" />
        <ModalBody>
          <StyledInput
            placeholder={placeholder}
            value={value}
            onChange={onChange}
          />
        </ModalBody>
        <ModalFooter>
          <StyledButton
            onClick={onSubmit}
            isLoading={isLoading}
            children={"Confirm"}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
