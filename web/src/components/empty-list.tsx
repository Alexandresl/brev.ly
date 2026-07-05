import { Link } from "@phosphor-icons/react";

export const EmptyList = () => {
  return (
    <div className="flex flex-col min-h-50 gap-6 items-center justify-center align-middle text-center">
      <Link size={32} />
      <p className="text-xs text-muted-foreground">
        AINDA NÃO EXISTEM LINKS CADASTRADOS
      </p>
    </div>
  );
};
