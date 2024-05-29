import { Button } from "@chakra-ui/react";

interface StyledButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  isLoading?: boolean;
  width?: string;
}

export default function StyledButton({
  children,
  onClick,
  isLoading = false,
  width,
}: StyledButtonProps) {
  return (
    <Button
      backgroundColor="sec.100"
      color="pri.100"
      onClick={onClick}
      isLoading={isLoading}
      _hover={{ backgroundColor: "sec.200" }}
      _active={{ backgroundColor: "sec.300" }}
      width={width}
    >
      {children}
    </Button>
  );
}
