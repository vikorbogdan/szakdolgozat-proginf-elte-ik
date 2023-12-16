import { trpc } from "@/app/_trpc/client";

export default function useOwnUserId() {
  const { data } = trpc.getOwnUserId.useQuery();

  return data?.id;
}
