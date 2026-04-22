import { prisma } from '@/src/core/prisma/client';

export const getDasboardAdmisionList = async () => {
  return prisma.dasboardAdmision.findMany();
};
