"use client";

import { AppShell } from "@/components/layout/app-shell";
import { useGetQAEvaluation } from "@/hooks/requests/useQAEvaluation";
import { useGetTranscriptsList } from "@/hooks/requests/useTranscripts";
import { formatDate } from "@/lib/utils";
import { TranscriptFileStatus } from "@/types/transcripts";
import {
  Box,
  Spinner,
  Table,
  Heading,
  Badge,
  Button,
  Text,
} from "@radix-ui/themes";
import { RefreshCwIcon } from "lucide-react";

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
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>File Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Transcript ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Interaction ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>CRM Ticket ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Tags</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Created At</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Interaction Time</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {transcriptsList.map((transcript) => {
              const {
                id,
                fileName,
                interactionId,
                crmTicketId,
                crmTags,
                status,
                createdAt,
                interactionDateTimeUtc,
              } = transcript;

              return (
                <Table.Row
                  key={id}
                  style={{ cursor: "pointer" }}
                  onClick={() => console.log("navigate")}
                >
                  <Table.Cell>{fileName}</Table.Cell>
                  <Table.Cell>{id}</Table.Cell>
                  <Table.Cell>{interactionId}</Table.Cell>
                  <Table.Cell>{crmTicketId}</Table.Cell>
                  <Table.Cell>
                    {crmTags.map((tag) => {
                      return (
                        <Badge key={tag} className="mr-1">
                          {tag}
                        </Badge>
                      );
                    })}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      color={
                        status === TranscriptFileStatus.ERROR ? "red" : "green"
                      }
                    >
                      {status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{formatDate(createdAt)}</Table.Cell>
                  <Table.Cell>{formatDate(interactionDateTimeUtc)}</Table.Cell>
                  <Table.Cell>
                    <Button variant="outline">
                      <RefreshCwIcon className="h-3 w-3" />
                      Reprocess
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Box>
    </AppShell>
  );
}
