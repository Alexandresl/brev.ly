import { fetchLinks } from "@/services/links-service";
import { useInfiniteQuery } from "@tanstack/react-query";

const LINKS_PAGE_SIZE = 10;

export function useLinks() {
  const query = useInfiniteQuery({
    queryKey: ["links"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchLinks({ page: pageParam, pageSize: LINKS_PAGE_SIZE }),
    getNextPageParam: (lastPage, allPages) => {
      const loadedLinksCount = allPages.reduce(
        (total, page) => total + page.links.length,
        0
      );

      if (loadedLinksCount >= lastPage.total || lastPage.links.length === 0) {
        return undefined;
      }

      return lastPage.page + 1;
    },
  });

  const links = query.data?.pages.flatMap((page) => page.links) ?? [];

  return {
    links,
    isLoading: query.isLoading,
    isError: query.isError,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    isFetching: query.isFetching,
    error:
      query.error instanceof Error
        ? query.error.message
        : query.error
          ? "Falha ao carregar os links"
          : null,
    reloadLinks: query.refetch
  };
}
