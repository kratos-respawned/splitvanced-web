import { AuthError } from "@/errors/auth-error";
import { db } from "@/lib/db";
import { APIErrorHandler } from "@/lib/error-handler";
import { getServerSession } from "@/lib/server-session";
import { getGroup } from "./groupData";
import { groupSchema } from "@/validatiors/group-schemas";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export const GET = async (req: Request) => {
  try {
    const groups = await getGroup();
    return Response.json({
      status: "success",
      data: groups,
    });
  } catch (error) {
    if (error instanceof AuthError)
      return Response.json({ status: "unauthenticated", error: error.message });
    const errMessage = APIErrorHandler(error);
    return Response.json({
      status: "error",
      error: errMessage,
    });
  }
};
export const POST = async (req: NextRequest) => {
  const json = await req.json();
  try {
    const { name: groupName } = groupSchema.parse(json);
    const { user, error } = await getServerSession();
    if (!user) throw new AuthError(error);
    const newGroup = await db.group.create({
      data: {
        name: groupName,
        members: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return Response.json({
      status: "success",
      data: newGroup,
    });
  } catch (error) {
    if (error instanceof AuthError)
      return Response.json({ status: "unauthenticated", error: error.message });
    const errMessage = APIErrorHandler(error);
    return Response.json({
      status: "error",
      error: errMessage,
    });
  }
};
