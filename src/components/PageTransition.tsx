"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionKey, setTransitionKey] = useState(pathname);

  useEffect(() => {
    setDisplayChildren(children);
    setTransitionKey(pathname);
  }, [pathname, children]);

  return (
    <div key={transitionKey} className="page-transition">
      {displayChildren}
    </div>
  );
}
