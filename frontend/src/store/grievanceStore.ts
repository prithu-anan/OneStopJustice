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
        const departments = [{ id: 'DPT-UTIL', name: 'Utilities' }, { id: 'DPT-HEALTH', name: 'Health' }];
        const authorities: AuthorityRef[] = [
          { id: 'UTIL-L0-DHK', name: 'Dhaka Electricity Office', level: 0, departmentId: 'DPT-UTIL', jurisdiction: { city: 'Dhaka' }, parentId: 'UTIL-L1' },
          { id: 'UTIL-L1', name: 'National Electricity Authority', level: 1, departmentId: 'DPT-UTIL', parentId: 'OMB' },
          { id: 'HEALTH-L0-DHK', name: 'Dhaka Health Office', level: 0, departmentId: 'DPT-HEALTH', jurisdiction: { city: 'Dhaka' }, parentId: 'HEALTH-L1' },
          { id: 'HEALTH-L1', name: 'National Health Authority', level: 1, departmentId: 'DPT-HEALTH', parentId: 'OMB' },
          { id: 'OMB', name: 'Ombudsman', level: 2, departmentId: 'GLOBAL' },
        ];
        const rules: EscalationRule[] = [
          { id: 'R-UTIL', name: 'Utilities Default', category: 'Utilities', departmentId: 'DPT-UTIL', levels: ['UTIL-L0-DHK', 'UTIL-L1', 'OMB'], slaDaysPerLevel: [7, 7, 10], citizenResponseDays: 5 },
          { id: 'R-HEALTH', name: 'Health Default', category: 'Health', departmentId: 'DPT-HEALTH', levels: ['HEALTH-L0-DHK', 'HEALTH-L1', 'OMB'], slaDaysPerLevel: [7, 10, 10], citizenResponseDays: 5 },
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
    }),
    { name: 'grievance-storage' }
  )
);


