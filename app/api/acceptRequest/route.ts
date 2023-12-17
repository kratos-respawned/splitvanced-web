import { db } from "@/lib/db";
import { APIErrorHandler } from "@/lib/error-handler";
import { getServerSession } from "@/lib/server-session";
import { friendshipSchema } from "@/validatiors/friendship-schema";

export const POST = async (req: Request) => {
  try {
    const { user, error } = await getServerSession();
    if (!user) {
      return Response.json({
        status: "unauthenticated",
        error: "You are not logged in",
      });
    }
    const json = await req.json();
    const { id } = friendshipSchema.parse(json);
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
    const newFriendship = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        friends: {
          connect: {
            id: id,
          },
        },
        friendOf: {
          connect: {
            id: id,
          },
        },
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
    });

    const deleteFriendRequest = await db.friendRequest.delete({
      where: {
        id: friendRequest.id,
      },
    });

    // unfriend
    // const removeFriend = await db.user.update({
    //   where: {
    //     id: user.id,
    //   },
    //   data: {
    //     friends: {
    //       disconnect: {
    //         email: "pallab@gmail.com",
    //       },
    //     },
    //   },
    // });

    return Response.json({ status: "authenticated", user: newFriendship });
  } catch (e) {
    const errorMessage = APIErrorHandler(e);
    return Response.json({ status: "error", error: errorMessage });
  }
};
