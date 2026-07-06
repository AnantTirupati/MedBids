export interface Medication {
  id: string;
  name: string;
  generic_name: string | null;
  dosage: string;
  form: string;
  quantity: number;
  frequency: string | null;
}
