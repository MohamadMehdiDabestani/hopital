import { prisma } from '@/src/core/prisma/client';

export const getDashboardDoctorList = async () => {
  return prisma.dashboardDoctor.findMany();
};
