import { TranscriptListResponse } from "@/types/transcripts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetTranscriptsList = () => {
  const { data, isPending } = useQuery({
    queryKey: ["transcripts"],
    queryFn: async () => {
      const { data } = await axios<TranscriptListResponse>(
        "/api/transcripts?page=1&pageSize=20",
        {
          method: "get",
          withCredentials: true,
        }
      );
      return data;
    },
  });

  return {
    transcriptsList: data?.items || [],
    isTranscriptsListPending: isPending,
  };
};
