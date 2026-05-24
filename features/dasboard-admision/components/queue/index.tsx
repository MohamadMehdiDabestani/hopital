"use client";
import { Fragment } from "react";
import { NewPatient } from "./newPatient";
import { ReceptionTable } from "./patientTable";
export const AdmisionQueue = () => {
  return (
    <Fragment>
      <NewPatient />
      <ReceptionTable />
    </Fragment>
  );
};
