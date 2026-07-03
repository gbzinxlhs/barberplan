import { prisma } from "./prisma";

const defaultHours = [
  { dayOfWeek: 1, startTime: "09:00", endTime: "19:00", isWorkingDay: true },
  { dayOfWeek: 2, startTime: "09:00", endTime: "19:00", isWorkingDay: true },
  { dayOfWeek: 3, startTime: "09:00", endTime: "19:00", isWorkingDay: true },
  { dayOfWeek: 4, startTime: "09:00", endTime: "19:00", isWorkingDay: true },
  { dayOfWeek: 5, startTime: "09:00", endTime: "19:00", isWorkingDay: true },
  { dayOfWeek: 6, startTime: "09:00", endTime: "17:00", isWorkingDay: true },
];

export async function createDefaultWorkingHours(tenantId: string) {
  const existing = await prisma.workingHour.count({ where: { tenantId } });
  if (existing > 0) return;

  await prisma.workingHour.createMany({
    data: defaultHours.map((h) => ({ ...h, tenantId })),
  });
}
