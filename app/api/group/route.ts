import { AuthError } from "@/errors/auth-error";
import { db } from "@/lib/db";
import { APIErrorHandler } from "@/lib/error-handler";
import { getServerSession } from "@/lib/server-session";

export const GET = async (req: Response) => {
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
export const POST = async (req: Response) => {
  const json = await req.json();
  try {
    const { user, error } = await getServerSession();
    if (!user) throw new AuthError(error);
    const newGroup = await db.group.create({
      data: {
        name: json.name,
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
export const getGroup = async () => {
  const { user, error } = await getServerSession();
  if (!user) throw new AuthError(error);
  return await db.group.findMany({});
};
