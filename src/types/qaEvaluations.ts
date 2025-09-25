import { DateTimeISO, PaginatedResponse } from "./common";

export type QAEvaluationParticipant = {
  messageCount: number;
  id: string;
  internalId: string;
  name: string;
  email: string;
  role: string; // TODO: Should be an enum
};

export type QAEvaluationListItem = {
  id: string;
  tenantId: number;
  formId: string;
  formVersion: string; // TODO: Should be an enum
  evaluationRequestId: string;
  totalPossible: number;
  score: number;
  agentName: string;
  agentId: string;
  createdAtUtc: DateTimeISO;
  interactionDateTimeUtc: DateTimeISO;
  transcriptId: string;
  interactionId: string;
  formName: string;
  participants: QAEvaluationParticipant[];
  messagesByUserCountJson: string;
  crmTicketId: string;
  scoreType: string; // TODO: Should be an enum
  useForScore: boolean;
  scoredByUserId: string;
  scorePercentage: number;
};

export type QAEvaluationListResponse = PaginatedResponse<QAEvaluationListItem>;
