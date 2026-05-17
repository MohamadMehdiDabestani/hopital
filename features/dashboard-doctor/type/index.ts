export type VisitHistory = {
  id: number;
  siteId: number;
  personId: number;
  doctorId: number;
  status: any;
  extraNotes: string | null;
  treatTime: string | null;
  firstName: string;
  lastName: string;
};
export type Item = {
  id: number;
  name: string;
}
export type MedicineItem = Item& {
  form: string | null;
};
export type MedicineList = { list: MedicineItem[] };
export type TestList = {list : Item[]}