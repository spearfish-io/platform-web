"use client";

import { AppShell } from "@/components/layout/app-shell";
import { useGetTranscriptsList } from "@/hooks/requests/useTranscripts";
import { Box, Spinner, Table, Heading } from "@radix-ui/themes";

export default function TranscriptListPage() {
  const { transcriptsList, isTranscriptsListPending } = useGetTranscriptsList();

  if (isTranscriptsListPending) {
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

  return (
    <AppShell>
      <Box style={{ padding: 16 }}>
        <Heading as="h1">Transcripts</Heading>
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
                fileLocation,
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
                  <Table.Cell>{fileLocation}</Table.Cell>
                  <Table.Cell>{interactionId}</Table.Cell>
                  <Table.Cell>{crmTicketId}</Table.Cell>
                  <Table.Cell>{crmTags.join(", ")}</Table.Cell>
                  <Table.Cell>{status}</Table.Cell>
                  <Table.Cell>{createdAt}</Table.Cell>
                  <Table.Cell>{interactionDateTimeUtc}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Box>
    </AppShell>
  );
}
