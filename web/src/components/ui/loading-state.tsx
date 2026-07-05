import { CircleNotch } from "@phosphor-icons/react";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = "Carregando..." }: LoadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6 text-muted-foreground">
      <CircleNotch size={28} className="animate-spin" />
      <p className="text-sm">{message}</p>
    </div>
  );
};
