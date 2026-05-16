export type VisitHistory = {
  id: number;
  siteId: number;
  personId: number;
  doctorId: number;
  status: any;
  extraNotes: string | null;
  treatTime: Date | null;
  firstName: string;
  lastName: string;
};
export type MedicineItem = {
  id: number;
  name: string;
  form: string | null;
};
export type MedicineList = { list: MedicineItem[] };
