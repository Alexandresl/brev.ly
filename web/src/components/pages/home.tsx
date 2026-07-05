import { CreateLink } from "@/components/layout/create-link/create-link";
import { MyLinks } from "@/components/layout/my-links/my-links.tsx";
import { useEffect, useRef, useState } from "react";

export function Home() {
  const createLinkContainerRef = useRef<HTMLDivElement | null>(null);
  const [createLinkHeight, setCreateLinkHeight] = useState<number>();

  useEffect(() => {
    const target = createLinkContainerRef.current;
    if (!target || typeof ResizeObserver === "undefined") return;

    const updateHeight = () => {
      setCreateLinkHeight(target.getBoundingClientRect().height);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(target);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="h-full min-h-0 space-y-4">
      <div className="h-full min-h-0 flex flex-col lg:flex-row lg:items-stretch gap-6">
        <div ref={createLinkContainerRef} className="w-full lg:w-95 lg:shrink-0 lg:self-start">
          <CreateLink />
        </div>
        
        <div className="w-full lg:flex-1 min-h-0">
          <MyLinks minHeight={createLinkHeight} />
        </div>
      </div>
    </div>
  )
}
