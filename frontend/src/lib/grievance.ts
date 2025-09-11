export type GrievanceStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'INFO_REQUESTED'
  | 'RESOLVED_PENDING_CONFIRM'
  | 'ESCALATED'
  | 'CLOSED_ACCEPTED'
  | 'CLOSED_AUTO'
  | 'WITHDRAWN';

export interface AuthorityRef {
  id: string;
  name: string;
  level: number; // 0 = lowest
  departmentId: string;
  parentId?: string;
  jurisdiction?: { state?: string; district?: string; city?: string };
}

export type GrievanceEventType =
  | 'SUBMIT'
  | 'ACK'
  | 'REQUEST_INFO'
  | 'INFO_PROVIDED'
  | 'FORWARD'
  | 'ASSIGN'
  | 'RESOLVE'
  | 'DISPUTE'
  | 'ACCEPT'
  | 'ESCALATE'
  | 'AUTO_CLOSE'
  | 'WITHDRAW';

export interface GrievanceEvent {
  type: GrievanceEventType;
  at: string;
  byRole: 'CITIZEN' | 'AUTHORITY_HANDLER' | 'AUTHORITY_ADMIN' | 'SYSTEM';
  byId?: string;
  note?: string;
  toAuthorityId?: string;
  attachments?: string[];
}

export interface Grievance {
  id: string;
  citizenId: string;
  category: string;
  departmentId: string;
  authorityId: string; // current handling office
  subject: string;
  description: string;
  desiredOutcome?: string;
  attachments?: string[];
  status: GrievanceStatus;
  slaDays: number;
  createdAt: string;
  updatedAt: string;
  statusSince: string;
  escalationLevel: number; // 0..N
  history: GrievanceEvent[];
  privacy: { shareContact: boolean; anonymous?: boolean };
}

export interface EscalationRule {
  id: string;
  name: string;
  category: string;
  departmentId: string;
  levels: string[]; // ordered authority IDs per level (0..)
  slaDaysPerLevel: number[]; // aligns with levels
  citizenResponseDays: number;
}

export const isSlaBreached = (statusSinceIso: string, slaDays: number): boolean => {
  const since = new Date(statusSinceIso).getTime();
  const deadline = since + slaDays * 24 * 60 * 60 * 1000;
  return Date.now() >= deadline;
};

export const daysRemaining = (statusSinceIso: string, slaDays: number): number => {
  const since = new Date(statusSinceIso).getTime();
  const deadline = since + slaDays * 24 * 60 * 60 * 1000;
  const diffMs = deadline - Date.now();
  return Math.ceil(diffMs / (24 * 60 * 60 * 1000));
};

