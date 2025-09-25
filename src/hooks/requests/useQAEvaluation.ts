import { TranscriptListResponse } from "@/types/transcripts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetQAEvaluation = () => {
  const { data, isPending } = useQuery({
    queryKey: ["qaEvaluation"],
    queryFn: async () => {
      const { data } = await axios<TranscriptListResponse>(
        "/api/qa/evaluations?page=1&pageSize=20",
        {
          method: "get",
          withCredentials: true,
        }
      );
      return data;
    },
  });

  return {
    qaEvaluations: data?.items || [],
    isQAEvaluationsPending: isPending,
  };
};
