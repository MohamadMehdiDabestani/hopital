"use client";
import { Fragment } from "react";
import { NewPatientForm } from "./newPatient";
import { ReceptionTable } from "./patientTable";
export const AdmisionQueue = () => {
  return (
    <Fragment>
      <NewPatientForm />
      <ReceptionTable />
    </Fragment>
  );
};
