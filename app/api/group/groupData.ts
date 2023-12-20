import { AuthError } from "@/errors/auth-error";
import { db } from "@/lib/db";
import { getServerSession } from "@/lib/server-session";

export const getGroupData = async (id: string) => {
  const { user, error } = await getServerSession();
  if (!user) throw new AuthError(error);
  return await db.group.findUnique({
    where: { id: id, members: { some: { id: user.id } } },
    include: {
      expenses: true,
      members: true,
    },
  });
};

export const getGroup = async () => {
  const { user, error } = await getServerSession();
  if (!user) throw new AuthError(error);
  return await db.group.findMany({});
};
