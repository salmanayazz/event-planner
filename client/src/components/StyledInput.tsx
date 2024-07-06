import { Input } from "@chakra-ui/react";

interface StyledInputProps {
  type?: string;
  placeholder: string;
  value?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isInvalid?: boolean;
}

export default function StyledInput({
  type = "text",
  placeholder,
  value,
  onChange,
  isInvalid = false,
}: StyledInputProps) {
  return (
    <Input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      backgroundColor="pri.300"
      borderColor="pri.100"
      color="sec.100"
      _placeholder={{ color: "sec.200" }}
      _focus={{ borderColor: "sec.100", boxShadow: "0 0 0 1px sec.100" }}
      isInvalid={isInvalid}
    />
  );
}
