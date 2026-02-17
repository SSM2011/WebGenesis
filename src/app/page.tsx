import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Client } from "./client";
import { Suspense } from "react";

export default async function page() {

  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.createAI.queryOptions({text: "subodh PREFETCH"}))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}> 
    <Suspense fallback={<p>Loading...</p>}>
    <Client />
    </Suspense>
    </HydrationBoundary>
  )
}