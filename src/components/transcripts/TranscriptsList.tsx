import { formatDate } from "@/lib/utils";
import { TranscriptFileStatus, TranscriptListItem } from "@/types/transcripts";
import { Badge, Button, Table } from "@radix-ui/themes";
import { RefreshCwIcon } from "lucide-react";

type TranscriptsListProps = {
  transcriptsList: TranscriptListItem[];
};

export default function TranscriptsList({
  transcriptsList,
}: TranscriptsListProps) {
  return (
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
              <Table.Cell>{`${fileName.substring(0, 10)}...`}</Table.Cell>
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
  );
}
