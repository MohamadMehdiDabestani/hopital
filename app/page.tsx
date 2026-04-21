"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

type Patient = {
  id: string;
  fullName: string;
  nationalCode: string;
  phone: string;
  doctorId: string;
  createdAt: string;
  status: string;
};

type QueueData = {
  receptionQueue: Patient[];
  waitingDoctorQueue: Patient[];
  inVisitQueue: Patient[];
};

export default function ReceptionPage() {
  const [queue, setQueue] = useState<QueueData>({
    receptionQueue: [],
    waitingDoctorQueue: [],
    inVisitQueue: [],
  });

  const [form, setForm] = useState({
    fullName: "",
    nationalCode: "",
    phone: "",
    doctorId: "doctor-1",
  });

  useEffect(() => {
    socket.connect();
    socket.emit("joinMe" , "abc")
    console.log("ddddd",socket.connected)

    socket.on("queue:update", (data: QueueData) => {
      setQueue(data);
    });

    return () => {
      socket.off("queue:update");
      socket.disconnect();
    };
  }, []);

  const handleAddPatient = () => {
    socket.emit("patient:add", form);
    setForm({
      fullName: "",
      nationalCode: "",
      phone: "",
      doctorId: "doctor-1",
    });
  };

  const finishReception = (patientId: string) => {
    socket.emit("patient:finishReception", { patientId });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>پنل پذیرش</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="نام و نام خانوادگی"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <input
          placeholder="کد ملی"
          value={form.nationalCode}
          onChange={(e) => setForm({ ...form, nationalCode: e.target.value })}
        />
        <input
          placeholder="شماره موبایل"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          placeholder="شناسه پزشک"
          value={form.doctorId}
          onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
        />
        <button onClick={handleAddPatient}>ثبت بیمار</button>
      </div>

      <h2>صف پذیرش</h2>
      <ul>
        {queue.receptionQueue.map((patient) => (
          <li key={patient.id}>
            {patient.fullName} - {patient.nationalCode}
            <button onClick={() => finishReception(patient.id)}>
              اتمام پذیرش
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
