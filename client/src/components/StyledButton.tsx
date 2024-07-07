import { Button } from "@chakra-ui/react";

interface StyledButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  isLoading?: boolean;
  width?: string;
  isDisabled?: boolean;
}

export default function StyledButton({
  children,
  onClick,
  isLoading = false,
  width,
  isDisabled = false,
}: StyledButtonProps) {
  return (
    <Button
      onClick={onClick}
      isLoading={isLoading}
      width={width}
      isDisabled={isDisabled}
    >
      {children}
    </Button>
  );
}
