"use client";

import { AppShell } from "@/components/layout/app-shell";
import TranscriptsList from "@/components/transcripts/TranscriptsList";
import { useGetQAEvaluation } from "@/hooks/requests/useQAEvaluation";
import { useGetTranscriptsList } from "@/hooks/requests/useTranscripts";
import { Box, Spinner, Heading, Text } from "@radix-ui/themes";

export default function TranscriptListPage() {
  const { transcriptsList, isTranscriptsListPending } = useGetTranscriptsList();
  const { qaEvaluations, isQAEvaluationsPending } = useGetQAEvaluation();

  console.log(qaEvaluations);

  if (isTranscriptsListPending || isQAEvaluationsPending) {
    return (
      <AppShell>
        <Box
          style={{
            justifyContent: "center",
            display: "flex",
            marginTop: 16,
          }}
        >
          <Spinner size="3" />
        </Box>
      </AppShell>
    );
  }

  if (transcriptsList.length === 0) {
    return (
      <AppShell>
        <Box
          style={{
            justifyContent: "center",
            display: "flex",
            marginTop: 16,
          }}
        >
          <Text>There are no transcripts to display at the moment.</Text>
        </Box>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Box style={{ padding: 16 }}>
        <Heading as="h1" style={{ marginBottom: 10 }}>
          Transcripts
        </Heading>
        <TranscriptsList transcriptsList={transcriptsList} />
      </Box>
    </AppShell>
  );
}
