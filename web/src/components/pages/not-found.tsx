import Image404 from "@/assets/404.svg"
import { CardLayout } from "@/components/ui/card-layout.tsx"

export function NotFound() {
  return (
    <CardLayout>
      <div className="flex flex-col items-center justify-center text-center space-y-6 w-full h-full">
        <div className="flex items-center justify-center">
          <img
            src={Image404}
            alt="404 - Página não encontrada"
            className="h-24"
          />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-600 dark:text-gray-200">
          Link não encontrado
        </h1>
        
        <p className="text-sm text-gray-500 dark:text-gray-300 max-w-sm">
          O link que você está tentando acessar não existe, foi removido ou é um URL inválido. Saiba mais em{" "}
          <a
            href="/"
            className="text-blue-base hover:underline hover:cursor-pointer font-medium"
          >
            brev.ly
          </a>
          .
        </p>
      </div>
    </CardLayout>
  )
}
