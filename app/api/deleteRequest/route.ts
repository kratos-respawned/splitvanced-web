import { db } from "@/lib/db";
import { APIErrorHandler } from "@/lib/error-handler";
import { getServerSession } from "@/lib/server-session";
import { friendshipSchema } from "@/validatiors/friendship-schema";

export const POST = async (req: Request) => {
  try {
    const reqJSON = await req.json();
    const { id } = friendshipSchema.parse(reqJSON);
    const { user, error } = await getServerSession();
    if (!user) {
      return Response.json({
        status: "unauthenticated",
        error: "You are not logged in",
      });
    }
    const friendRequest = await db.friendRequest.findFirst({
      where: {
        fromId: user.id,
        toId: id,
      },
    });
    if (!friendRequest) {
      return Response.json({
        status: "error",
        error: "No friend request found",
      });
    }
    const deletedReq = await db.friendRequest.delete({
      where: {
        id: friendRequest.id,
      },
    });
    return Response.json({
      status: "success",
      data: deletedReq,
    });
  } catch (error) {
    const errMessage = APIErrorHandler(error);
    return Response.json({
      status: "error",
      error: errMessage,
    });
  }
};
