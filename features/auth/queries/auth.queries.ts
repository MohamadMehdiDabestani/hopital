import { prisma } from '@/src/core/prisma/client';

export const getAuthList = async () => {
  return prisma.auth.findMany();
};
