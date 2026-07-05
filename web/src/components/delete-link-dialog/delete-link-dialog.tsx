import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Trash } from "@phosphor-icons/react";
import { Trash2Icon } from "lucide-react";

interface DeleteLinkDialogProps {
  shortUrl: string;
  onConfirm: () => void;
  isPending?: boolean;
}

export function DeleteLinkDialog({ shortUrl, onConfirm, isPending }: DeleteLinkDialogProps) {
  const triggerLabel = `Deletar link brev.ly/${shortUrl}`;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="h-8 w-8"
          disabled={isPending}
          aria-label={triggerLabel}
          title={triggerLabel}
        >
          <Trash size={14} className="text-gray-600" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogTitle>Deletar link</AlertDialogTitle>
        <AlertDialogDescription>
          Tem certeza que deseja deletar{" "}
          <span className="font-medium text-foreground">
            brev.ly/{shortUrl}
          </span>
          ? Esta ação não pode ser desfeita.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel size='sm'>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction size='sm' onClick={onConfirm}>
            <Trash2Icon />
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
