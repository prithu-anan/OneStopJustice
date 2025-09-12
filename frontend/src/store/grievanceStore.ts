import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Grievance, AuthorityRef, EscalationRule, GrievanceEvent } from '@/lib/grievance';

interface GrievanceState {
  authorities: AuthorityRef[];
  rules: EscalationRule[];
  grievances: Grievance[];
  seedDemoData: () => void;
  fileGrievance: (g: Omit<Grievance, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'statusSince' | 'history' | 'escalationLevel'>) => Grievance;
  provideInfo: (id: string, event: GrievanceEvent) => void;
  requestInfo: (id: string, event: GrievanceEvent) => void;
  resolve: (id: string, event: GrievanceEvent) => void;
  accept: (id: string, event: GrievanceEvent) => void;
  dispute: (id: string, event: GrievanceEvent) => void;
  escalate: (id: string, event: GrievanceEvent) => void;
  withdraw: (id: string, event: GrievanceEvent) => void;
  archive: (id: string, event: GrievanceEvent) => void;
  autoCloseNoResponse: (id: string, event: GrievanceEvent) => void;
  forward: (id: string, event: GrievanceEvent) => void;
  authorityEscalate: (id: string, event: GrievanceEvent) => void;
}

const nowIso = () => new Date().toISOString();

export const useGrievanceStore = create<GrievanceState>()(
  persist(
    (set, get) => ({
      authorities: [],
      rules: [],
      grievances: [],
      seedDemoData: () => {
        const hasSeeded = get().authorities.length > 0 || get().rules.length > 0 || get().grievances.length > 0;
        if (hasSeeded) return;
        const departments = [
          { id: 'DPT-UTIL', name: 'Utilities' }, 
          { id: 'DPT-HEALTH', name: 'Health' },
          { id: 'DPT-EDU', name: 'Education' },
          { id: 'DPT-TRANSPORT', name: 'Transportation' },
          { id: 'DPT-HOUSING', name: 'Housing' },
          { id: 'DPT-ENV', name: 'Environment' }
        ];
        const authorities: AuthorityRef[] = [
          // Utilities
          { id: 'UTIL-L0-DHK', name: 'Dhaka Electricity Office', level: 0, departmentId: 'DPT-UTIL', jurisdiction: { city: 'Dhaka' }, parentId: 'UTIL-L1' },
          { id: 'UTIL-L0-CTG', name: 'Chittagong Electricity Office', level: 0, departmentId: 'DPT-UTIL', jurisdiction: { city: 'Chittagong' }, parentId: 'UTIL-L1' },
          { id: 'UTIL-L1', name: 'National Electricity Authority', level: 1, departmentId: 'DPT-UTIL', parentId: 'OMB' },
          // Health
          { id: 'HEALTH-L0-DHK', name: 'Dhaka Health Office', level: 0, departmentId: 'DPT-HEALTH', jurisdiction: { city: 'Dhaka' }, parentId: 'HEALTH-L1' },
          { id: 'HEALTH-L0-CTG', name: 'Chittagong Health Office', level: 0, departmentId: 'DPT-HEALTH', jurisdiction: { city: 'Chittagong' }, parentId: 'HEALTH-L1' },
          { id: 'HEALTH-L1', name: 'National Health Authority', level: 1, departmentId: 'DPT-HEALTH', parentId: 'OMB' },
          // Education
          { id: 'EDU-L0-DHK', name: 'Dhaka Education Office', level: 0, departmentId: 'DPT-EDU', jurisdiction: { city: 'Dhaka' }, parentId: 'EDU-L1' },
          { id: 'EDU-L1', name: 'National Education Authority', level: 1, departmentId: 'DPT-EDU', parentId: 'OMB' },
          // Transportation
          { id: 'TRANSPORT-L0-DHK', name: 'Dhaka Transport Office', level: 0, departmentId: 'DPT-TRANSPORT', jurisdiction: { city: 'Dhaka' }, parentId: 'TRANSPORT-L1' },
          { id: 'TRANSPORT-L1', name: 'National Transport Authority', level: 1, departmentId: 'DPT-TRANSPORT', parentId: 'OMB' },
          // Housing
          { id: 'HOUSING-L0-DHK', name: 'Dhaka Housing Office', level: 0, departmentId: 'DPT-HOUSING', jurisdiction: { city: 'Dhaka' }, parentId: 'HOUSING-L1' },
          { id: 'HOUSING-L1', name: 'National Housing Authority', level: 1, departmentId: 'DPT-HOUSING', parentId: 'OMB' },
          // Environment
          { id: 'ENV-L0-DHK', name: 'Dhaka Environment Office', level: 0, departmentId: 'DPT-ENV', jurisdiction: { city: 'Dhaka' }, parentId: 'ENV-L1' },
          { id: 'ENV-L1', name: 'National Environment Authority', level: 1, departmentId: 'DPT-ENV', parentId: 'OMB' },
          // Global
          { id: 'OMB', name: 'Ombudsman', level: 2, departmentId: 'GLOBAL' },
        ];
        const rules: EscalationRule[] = [
          { id: 'R-UTIL', name: 'Utilities Default', category: 'Utilities', departmentId: 'DPT-UTIL', levels: ['UTIL-L0-DHK', 'UTIL-L1', 'OMB'], slaDaysPerLevel: [7, 7, 10], citizenResponseDays: 5 },
          { id: 'R-HEALTH', name: 'Health Default', category: 'Health', departmentId: 'DPT-HEALTH', levels: ['HEALTH-L0-DHK', 'HEALTH-L1', 'OMB'], slaDaysPerLevel: [7, 10, 10], citizenResponseDays: 5 },
          { id: 'R-EDU', name: 'Education Default', category: 'Education', departmentId: 'DPT-EDU', levels: ['EDU-L0-DHK', 'EDU-L1', 'OMB'], slaDaysPerLevel: [10, 14, 15], citizenResponseDays: 7 },
          { id: 'R-TRANSPORT', name: 'Transportation Default', category: 'Transportation', departmentId: 'DPT-TRANSPORT', levels: ['TRANSPORT-L0-DHK', 'TRANSPORT-L1', 'OMB'], slaDaysPerLevel: [5, 7, 10], citizenResponseDays: 3 },
          { id: 'R-HOUSING', name: 'Housing Default', category: 'Housing', departmentId: 'DPT-HOUSING', levels: ['HOUSING-L0-DHK', 'HOUSING-L1', 'OMB'], slaDaysPerLevel: [14, 21, 30], citizenResponseDays: 10 },
          { id: 'R-ENV', name: 'Environment Default', category: 'Environment', departmentId: 'DPT-ENV', levels: ['ENV-L0-DHK', 'ENV-L1', 'OMB'], slaDaysPerLevel: [10, 14, 20], citizenResponseDays: 7 },
        ];
        const grievances: Grievance[] = [];
        set({ authorities, rules, grievances });
      },
      fileGrievance: (g) => {
        const id = `GRV-${Date.now()}`;
        const createdAt = nowIso();
        const status: Grievance['status'] = 'SUBMITTED';
        const statusSince = createdAt;
        const escalationLevel = 0;
        const newG: Grievance = { ...g, id, createdAt, updatedAt: createdAt, status, statusSince, escalationLevel, history: [{ type: 'SUBMIT', at: createdAt, byRole: 'CITIZEN' }] };
        set((state) => ({ grievances: [newG, ...state.grievances] }));
        return newG;
      },
      provideInfo: (id, event) => {
        set((state) => ({
          grievances: state.grievances.map((gr) =>
            gr.id === id
              ? { ...gr, status: 'UNDER_REVIEW', updatedAt: nowIso(), statusSince: nowIso(), history: [...gr.history, event] }
              : gr
          ),
        }));
      },
      requestInfo: (id, event) => {
        set((state) => ({
          grievances: state.grievances.map((gr) =>
            gr.id === id
              ? { ...gr, status: 'INFO_REQUESTED', updatedAt: nowIso(), statusSince: nowIso(), history: [...gr.history, event] }
              : gr
          ),
        }));
      },
      resolve: (id, event) => {
        set((state) => ({
          grievances: state.grievances.map((gr) =>
            gr.id === id
              ? { ...gr, status: 'RESOLVED_PENDING_CONFIRM', updatedAt: nowIso(), statusSince: nowIso(), history: [...gr.history, event] }
              : gr
          ),
        }));
      },
      accept: (id, event) => {
        set((state) => ({
          grievances: state.grievances.map((gr) =>
            gr.id === id
              ? { ...gr, status: 'CLOSED_ACCEPTED', updatedAt: nowIso(), history: [...gr.history, event] }
              : gr
          ),
        }));
      },
      dispute: (id, event) => {
        set((state) => ({
          grievances: state.grievances.map((gr) =>
            gr.id === id
              ? { ...gr, status: 'UNDER_REVIEW', updatedAt: nowIso(), statusSince: nowIso(), history: [...gr.history, event] }
              : gr
          ),
        }));
      },
      escalate: (id, event) => {
        set((state) => ({
          grievances: state.grievances.map((gr) =>
            gr.id === id
              ? { ...gr, status: 'UNDER_REVIEW', escalationLevel: gr.escalationLevel + 1, authorityId: event.toAuthorityId || gr.authorityId, updatedAt: nowIso(), statusSince: nowIso(), history: [...gr.history, event] }
              : gr
          ),
        }));
      },
      withdraw: (id, event) => {
        set((state) => ({
          grievances: state.grievances.map((gr) =>
            gr.id === id
              ? { ...gr, status: 'WITHDRAWN', updatedAt: nowIso(), history: [...gr.history, event] }
              : gr
          ),
        }));
      },
      archive: (id, event) => {
        set((state) => ({
          grievances: state.grievances.map((gr) =>
            gr.id === id
              ? { ...gr, status: 'ARCHIVED', updatedAt: nowIso(), history: [...gr.history, event] }
              : gr
          ),
        }));
      },
      autoCloseNoResponse: (id, event) => {
        set((state) => ({
          grievances: state.grievances.map((gr) =>
            gr.id === id
              ? { ...gr, status: 'CLOSED_NO_RESPONSE', updatedAt: nowIso(), history: [...gr.history, event] }
              : gr
          ),
        }));
      },
      forward: (id, event) => {
        set((state) => ({
          grievances: state.grievances.map((gr) =>
            gr.id === id
              ? { ...gr, authorityId: event.toAuthorityId || gr.authorityId, updatedAt: nowIso(), statusSince: nowIso(), history: [...gr.history, event] }
              : gr
          ),
        }));
      },
      authorityEscalate: (id, event) => {
        set((state) => ({
          grievances: state.grievances.map((gr) =>
            gr.id === id
              ? { ...gr, status: 'AUTHORITY_ESCALATED', authorityId: event.toAuthorityId || gr.authorityId, updatedAt: nowIso(), statusSince: nowIso(), history: [...gr.history, event] }
              : gr
          ),
        }));
      },
    }),
    { name: 'grievance-storage' }
  )
);


