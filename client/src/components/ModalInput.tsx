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
          <Input
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            backgroundColor="pri.300"
            borderColor="pri.100"
            color="sec.100"
            _placeholder={{ color: "sec.200" }}
            _focus={{ borderColor: "sec.100", boxShadow: "0 0 0 1px sec.100" }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            backgroundColor="sec.100"
            color="pri.100"
            onClick={onSubmit}
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
