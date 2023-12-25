import { db } from "@/lib/db";
import { APIErrorHandler } from "@/lib/error-handler";
import { getServerSession } from "@/lib/server-session";
import { friendshipRequestActionSchema } from "@/validatiors/friendship-schema";

export const POST = async (req: Request, { params }: { params: { id: string }}) => {
  try {
    const { user } = await getServerSession();
    if (!user) {
      return Response.json({
        status: "unauthenticated",
        error: "You are not logged in",
      });
    }

    const reqJSON = await req.json();
    const { accepted } = friendshipRequestActionSchema.parse(reqJSON);

    const friendshipRequest = await db.friendRequest.findFirst({
      where: {
        id: params.id,
      }
    })

    if (accepted) {
      const response = db.user.update({
        where: {
          id: user.id,
        },
        data: {
          friends: {
            connect: {
              id: friendshipRequest?.fromId,
            }
          },
          friendOf: {
            connect: {
              id: friendshipRequest?.toId,
            }
          }
        },
        select: {
          id: true,
          name: true,
          email: true,
          friends: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      return Response.json(response)
    } else {
      const response = db.friendRequest.delete({
        where: {
          id: params.id,
        }
      })

      return Response.json(response)
    }
  } catch (e) {
    const errorMessage = APIErrorHandler(e);
    return Response.json({ status: "error", error: errorMessage });
  }
}