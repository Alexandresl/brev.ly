import { Copy } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import type { Link } from "@/types/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeLink } from "@/services/links-service";
import { DeleteLinkDialog } from "@/components/delete-link-dialog/delete-link-dialog.tsx";
import { toast } from "sonner";

interface LinksListProps {
  links: Link[];
}

export const LinksList = ({ links }: LinksListProps) => {
  const queryClient = useQueryClient();

  const { mutate: handleDelete, isPending } = useMutation({
    mutationFn: (id: string) => removeLink(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });

  const handleCopyShortUrl = async (shortUrl: string) => {
    const frontendUrl =
      import.meta.env.VITE_FRONTEND_URL ?? window.location.origin;
    const cleanFrontendUrl = frontendUrl.replace(/\/$/, "");
    const fullUrl = `${cleanFrontendUrl}/${shortUrl}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success("Link copiado para a área de transferência!");
    } catch {
      toast.error("Falha ao copiar o link.");
    }
  };

  const handleOpenRedirect = (shortUrl: string) => {
    window.open(`/${shortUrl}`, "_blank", "noopener,noreferrer");
  };

  return (
    <ul className="space-y-3 pt-4" aria-label="Meus links encurtados">
      {links.map((link) => (
        <li
          key={link.id}
          className="flex items-center gap-4 p-4 border rounded-lg transition-colors"
        >
          <div className="flex-1 space-y-2 min-w-0">
            <button
              type="button"
              onClick={() => handleOpenRedirect(link.shortUrl)}
              aria-label={`Abrir link encurtado brev.ly/${link.shortUrl}`}
              title={`Abrir link encurtado brev.ly/${link.shortUrl}`}
              className="font-semibold text-md text-primary truncate text-left hover:underline hover:cursor-pointer"
            >
              {`brev.ly/${link.shortUrl}`}
            </button>

            <p className="text-sm text-muted-foreground truncate">
              {link.originalUrl}
            </p>
          </div>

          <div className="flex items-center gap-2 justify-center">
            <p className="text-sm text-gray-500 dark:text-gray-200 p-0">
              {`${link.accessCount} acessos`}
            </p>

            <Button
              variant="secondary"
              size="sm"
              className="h-8 w-8"
              aria-label={`Copiar link encurtado brev.ly/${link.shortUrl}`}
              title={`Copiar link encurtado brev.ly/${link.shortUrl}`}
              onClick={() => handleCopyShortUrl(link.shortUrl)}
            >
              <Copy size={20} className="text-gray-600" aria-hidden="true" />
            </Button>

            <DeleteLinkDialog
              shortUrl={link.shortUrl}
              onConfirm={() => handleDelete(link.id)}
              isPending={isPending}
            />
          </div>
        </li>
      ))}
    </ul>
  );
};
