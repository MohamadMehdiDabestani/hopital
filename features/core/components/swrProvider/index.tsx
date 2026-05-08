"use client";

import { SWRConfig } from "swr";

export function SWRProviders({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        keepPreviousData: true,
        fetcher: (url: string) => fetch(url, { cache: "no-store" }).then(r => r.json()),
      }}
    >
      {children}
    </SWRConfig>
  );
}
