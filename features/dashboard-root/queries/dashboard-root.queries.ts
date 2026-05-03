import { prisma } from '@/src/core/prisma/client';

export const getDashboardRootList = async () => {
  return prisma.dashboardRoot.findMany();
};
