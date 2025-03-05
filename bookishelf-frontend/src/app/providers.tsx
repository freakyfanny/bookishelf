"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (<div className="mt-25 p-6"><QueryClientProvider client={queryClient}>{children}</QueryClientProvider></div>);
}