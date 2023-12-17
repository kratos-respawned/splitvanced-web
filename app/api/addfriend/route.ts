import { db } from "@/lib/db";
import { getServerSession } from "@/lib/server-session";

export const GET = async (req: Request) => {
  const { user, error } = await getServerSession();
  if (!user) {
    return Response.json({
      status: "unauthenticated",
      error: "You are not logged in",
    });
  }
  try {
    const friends = await db.user.findUnique({
      where: {
        email: user.email,
      },
      select: {
        name: true,
        friendOf: true,
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

    // two way friend both are friendof each other
    // const addFriend = await db.user.update({
    //   where: {
    //     id: user.id,
    //   },
    //   data: {
    //     friends: {
    //       connect: {
    //         email: "pallab@gmail.com",
    //       },
    //     },
    //     friendOf: {
    //       connect: {
    //         email: "pallab@gmail.com",
    //       },
    //     },
    //   },
    // });

    return Response.json({ status: "authenticated", user: friends });
  } catch (e) {
    return Response.json({ status: "error", error: e });
  }
};
