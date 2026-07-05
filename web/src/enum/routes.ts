export const AppRoutes = {
  HOME: "/",
  NOT_FOUND_PAGE: "/not-found",
  REDIRECT: "/:shortUrl",
} as const;

export type AppRoute = (typeof AppRoutes)[keyof typeof AppRoutes];
