import { prisma } from '@/src/core/prisma/client';

export const getDashboardMedicineList = async () => {
  return prisma.dashboardMedicine.findMany();
};
