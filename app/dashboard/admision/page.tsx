import {Fragment} from 'react'
import { NewPatient, ReceptionTable } from "@/features/dasboard-admision";

export default function DasoboardAdmisionPage() {
  return (
    <Fragment>
      <NewPatient />
      <ReceptionTable />
    </Fragment>
  );
}
