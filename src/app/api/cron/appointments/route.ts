import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expected = process.env.CRON_SECRET;

  if (!expected || authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const results = {
    completed: 0,
    cancelledNoShow: 0,
    cancelledPending: 0,
  };

  const completed = await prisma.appointment.updateMany({
    where: {
      status: "confirmed",
      endTime: { lte: now },
    },
    data: { status: "completed" },
  });
  results.completed = completed.count;

  const thirtyMinAgo = new Date(now.getTime() - 30 * 60 * 1000);
  const noShows = await prisma.appointment.updateMany({
    where: {
      status: "confirmed",
      startTime: { lte: thirtyMinAgo },
    },
    data: { status: "cancelled" },
  });
  results.cancelledNoShow = noShows.count;

  const fifteenMinAgo = new Date(now.getTime() - 15 * 60 * 1000);
  const pendingExpired = await prisma.appointment.updateMany({
    where: {
      status: "pending",
      startTime: { lte: fifteenMinAgo },
    },
    data: { status: "cancelled" },
  });
  results.cancelledPending = pendingExpired.count;

  return NextResponse.json({ ok: true, now: now.toISOString(), results });
}
