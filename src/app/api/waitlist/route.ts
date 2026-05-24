import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface WaitlistEntry {
  id: string;
  firstName: string;
  email: string;
  phone?: string;
  timestamp: string;
  ip?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "waitlist.json");

async function readWaitlist(): Promise<WaitlistEntry[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as WaitlistEntry[];
  } catch {
    // File doesn't exist yet — return empty list
    return [];
  }
}

async function writeWaitlist(entries: WaitlistEntry[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), "utf-8");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, email, phone } = body as {
      firstName?: string;
      email?: string;
      phone?: string;
    };

    // ── Validation ──
    if (!firstName || typeof firstName !== "string" || firstName.trim().length === 0) {
      return NextResponse.json(
        { error: "First name is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    // ── Duplicate check ──
    const existing = await readWaitlist();
    const alreadyJoined = existing.some(
      (e) => e.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (alreadyJoined) {
      // Treat as success so we don't leak which emails are registered
      return NextResponse.json({ success: true, duplicate: true }, { status: 200 });
    }

    // ── Persist ──
    const entry: WaitlistEntry = {
      id: crypto.randomUUID(),
      firstName: firstName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      timestamp: new Date().toISOString(),
      ip: req.headers.get("x-forwarded-for") ?? undefined,
    };

    existing.push(entry);
    await writeWaitlist(existing);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("[waitlist] POST error:", err);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}

// GET — returns count only (no PII exposed)
export async function GET() {
  try {
    const entries = await readWaitlist();
    return NextResponse.json({ count: entries.length }, { status: 200 });
  } catch {
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}
