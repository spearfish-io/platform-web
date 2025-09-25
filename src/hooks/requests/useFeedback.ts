import { TranscriptListResponse } from "@/types/transcripts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetFeedbackList = () => {
  const { data, isPending } = useQuery({
    queryKey: ["feedback"],
    queryFn: async () => {
      const { data } = await axios<TranscriptListResponse>(
        "/api/feedback?page=1&pageSize=20",
        {
          method: "get",
          withCredentials: true,
        }
      );
      return data;
    },
  });

  return {
    feedbackList: data?.items || [],
    isFeedbackListPending: isPending,
  };
};
