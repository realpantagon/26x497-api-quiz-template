import { getPrisma } from "@/libs/getPrisma";
import { Student } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export type StudentGetResponse = {
  students: Student[];
};

export const GET = async () => {
  const prisma = getPrisma();

  const students = await prisma.student.findMany({
    orderBy: {
      studentId: 'asc',
    },
  });

  return NextResponse.json<StudentGetResponse>({
    students: students,
  });
};

export type StudentPostOKResponse = { ok: true };
export type StudentPostErrorResponse = { ok: false; message: string };
export type StudentPostResponse =
  | StudentPostOKResponse
  | StudentPostErrorResponse;

export type StudentPostBody = Pick<
  Student,
  "studentId" | "firstName" | "lastName"
>;

export const POST = async (request: NextRequest) => {
  const body = (await request.json()) as StudentPostBody;
  const prisma = getPrisma();

  try {
    await prisma.student.create({
      data: {
        studentId: body.studentId,
        firstName: body.firstName,
        lastName: body.lastName,
      },
    });

    return NextResponse.json<StudentPostOKResponse>({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json<StudentPostErrorResponse>({
        ok: false,
        message: "Student ID already exists",
      }, { status: 400 });
    } else {
      throw error;
    }
  }
};

  