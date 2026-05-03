import { prisma } from '@/src/core/prisma/client';

export const getDashboardManagerList = async () => {
  return prisma.dashboardManager.findMany();
};
