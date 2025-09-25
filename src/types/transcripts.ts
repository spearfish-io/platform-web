import { DateTimeISO, PaginatedResponse } from "./common";

export enum TranscriptFileStatus {
  NEW = "New",
  PROCESSING = "Processing",
  READY = "Ready",
  ERROR = "Error",
}

export type TranscriptListItem = {
  id: string;
  tenantId: number;
  fileName: string;
  fileLocation: string;
  interactionId: string;
  createdAt: DateTimeISO;
  createdBy: string;
  interactionDateTimeUtc: DateTimeISO;
  status: TranscriptFileStatus;
  error: string;
  primaryAgentEntityId: string;
  customerEntityId: string;
  allEntities: string[];
  crmTags: string[];
  crmTicketId: string;
  channel: string;
  direction: string;
  source: string;
  destination: string;
  queue: string;
  queueExt: string;
};

export type TranscriptListResponse = PaginatedResponse<TranscriptListItem>;
