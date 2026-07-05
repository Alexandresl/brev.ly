import { CardLayout } from "@/components/ui/card-layout"
import LogoIcon from "@/assets/Logo_Icon.svg"
import { useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getLinkByShortUrlService } from "@/services/get-link-by-short-url/get-link-by-short-url.service"
import { LINKS_CHANNEL_NAME, type LinksChannelMessage } from "@/lib/links-channel"
import { AppRoutes } from "@/enum/routes"

export function Redirecting() {
  const { shortUrl } = useParams<{ shortUrl: string }>()
  const navigate = useNavigate()
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    if (!shortUrl) {
      navigate(AppRoutes.NOT_FOUND_PAGE, { replace: true })
      return
    }

    getLinkByShortUrlService(shortUrl)
      .then(({ originalUrl }) => {
        const channel = new BroadcastChannel(LINKS_CHANNEL_NAME)
        const message: LinksChannelMessage = { type: "link-accessed", shortUrl }
        channel.postMessage(message)
        channel.close()
        window.location.href = originalUrl
      })
      .catch(() => {
        navigate(AppRoutes.NOT_FOUND_PAGE, { replace: true })
      })
  }, [shortUrl, navigate])

  return (
    <CardLayout>
      <div className="flex flex-col items-center justify-center text-center space-y-6 w-full h-full">
        <div className="w-12 h-12 flex items-center justify-center">
          <img
            src={LogoIcon}
            alt="Ícone do Brev.ly"
            className="w-full h-full animate-logo-pulse"
          />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-600 dark:text-gray-200">
            Redirecionando...
          </h1>
          
          <p className="text-sm text-gray-500 dark:text-gray-300">
            O link será aberto automaticamente em alguns instantes.
          </p>
        </div>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-400 w-full mt-auto">
          <p className="text-xs text-gray-500 dark:text-gray-300">
            Não foi redirecionado?{" "}
            <a
              href="/"
              className="text-blue-base hover:underline hover:cursor-pointer font-medium"
            >
              Clique aqui
            </a>
          </p>
        </div>
      </div>
    </CardLayout>
  )
}
