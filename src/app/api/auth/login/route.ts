import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { DEMO_USERS } from "@/lib/demoData";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid credentials format" }, { status: 400 });
    }

    const { email, password } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    let user: any = null;

    try {
      user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
    } catch (dbErr) {
      console.warn("Database unavailable during login, checking demo credentials:", dbErr);
    }

    // Fallback to demonstration user dataset if DB is empty or unreachable
    if (!user) {
      const demoMatch = Object.values(DEMO_USERS).find(
        (u) => u.email.toLowerCase() === normalizedEmail
      );

      if (demoMatch && password === "KitchenProof@123") {
        user = {
          id: demoMatch.userId,
          email: demoMatch.email,
          name: demoMatch.name,
          role: demoMatch.role,
          passwordHash: null,
        };
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password combination." },
        { status: 401 }
      );
    }

    // If real user with password hash, verify hash
    if (user.passwordHash) {
      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid email or password combination." },
          { status: 401 }
        );
      }
    }

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
    });

    await setSessionCookie(token);

    // Optional audit log (non-blocking)
    try {
      await prisma.auditLog.create({
        data: {
          actorId: user.id,
          actorRole: user.role,
          action: "USER_LOGIN",
          entityType: "User",
          entityId: user.id,
        },
      });
    } catch {
      // Audit log silent in demo mode
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal authentication error" }, { status: 500 });
  }
}
