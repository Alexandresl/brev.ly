import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addLink } from "@/services/links-service.ts";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLinkSchema } from "@/schema/create-link.tsx";
import axios from "axios";

type CreateLinkFormData = z.infer<typeof createLinkSchema>;

export function CreateLink() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateLinkFormData>({
    resolver: zodResolver(createLinkSchema),
    mode: "onSubmit",
    defaultValues: {
      originalUrl: "",
      shortUrl: "brev.ly/",
    },
  });

  const { mutate: handleSubmitCreate, isPending } = useMutation({
    mutationKey: ["create-link"],
    mutationFn: addLink,
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["links"] });
      toast.success("Link criado com sucesso.");
    },
    onError: (err) => {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        toast.error("Erro de cadastro", {
          description: "Essa url encurtada já existe",
        });
      } else {
        toast.error("Erro de cadastro", {
          description: err instanceof Error ? err.message : "Ocorreu um erro inesperado",
        });
      }
    },
  });

  const onSubmit = (data: CreateLinkFormData) => {
    handleSubmitCreate(data);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Novo Link                           </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
          aria-busy={isPending}
        >
          <div className="space-y-2">
            <Label htmlFor="original-url">LINK ORIGINAL</Label>
            <Input
              id="original-url"
              type="url"
              placeholder="https://www.exemplo.com"
              className="placeholder:text-muted-foreground/40"
              aria-invalid={!!errors.originalUrl}
              aria-describedby={errors.originalUrl ? "original-url-error" : undefined}
              {...register("originalUrl")}
            />
            {errors.originalUrl?.message && (
              <p id="original-url-error" className="text-sm text-destructive">
                {errors.originalUrl.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="short-url">LINK ENCURTADO</Label>
            <Input
              id="short-url"
              type="text"
              placeholder="brev.ly/"
              className="placeholder:text-muted-foreground/40"
              aria-invalid={!!errors.shortUrl}
              aria-describedby={errors.shortUrl ? "short-url-error" : undefined}
              {...register("shortUrl", {
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  let val = e.target.value;
                  if (!val.startsWith("brev.ly/")) {
                    val = "brev.ly/" + val.replace(/^brev\.ly\/?|^brev\/?|^bre\/?|^br\/?|^b\/?/, "");
                  }
                  e.target.value = val;
                }
              })}
              onFocus={(e) => {
                const input = e.currentTarget;
                if (input.selectionStart !== null && input.selectionStart < 8) {
                  input.setSelectionRange(8, 8);
                }
              }}
              onSelect={(e) => {
                const input = e.currentTarget;
                if (input.selectionStart !== null && input.selectionStart < 8) {
                  input.setSelectionRange(8, 8);
                }
              }}
              onClick={(e) => {
                const input = e.currentTarget;
                if (input.selectionStart !== null && input.selectionStart < 8) {
                  input.setSelectionRange(8, 8);
                }
              }}
              onKeyDown={(e) => {
                const input = e.currentTarget;
                if (
                  (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "Home") &&
                  input.selectionStart !== null &&
                  input.selectionStart <= 8
                ) {
                  e.preventDefault();
                  input.setSelectionRange(8, 8);
                }
              }}
            />
            {errors.shortUrl?.message && (
              <p id="short-url-error" className="text-sm text-destructive">
                {errors.shortUrl.message}
              </p>
            )}
          </div>



          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar Link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
