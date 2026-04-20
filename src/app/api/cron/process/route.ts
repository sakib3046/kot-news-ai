import { NextResponse } from "next/server";

const removedMessage = {
  status: "gone",
  endpoint: "/api/cron/process",
  message: "Cron processing has been removed from this project.",
};

export async function POST() {
  return NextResponse.json(removedMessage, { status: 410 });
}

export async function GET() {
  return NextResponse.json(removedMessage, { status: 410 });
}