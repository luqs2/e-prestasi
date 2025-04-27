
export interface Criterion {
  id?: number;
  name: string;
  description: string;
  class_id: number;
  created_at?: string;
  updated_at?: string;
}
export type NewCriterion = Omit<Criterion, 'id' | 'created_at' | 'updated_at'>;
export type CriterionUpdate = Partial<Omit<Criterion, 'id' | 'class_id' | 'created_at' | 'updated_at'>>;