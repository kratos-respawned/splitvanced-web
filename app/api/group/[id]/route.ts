import { AuthError } from "@/errors/auth-error";
import { db } from "@/lib/db";
import { APIErrorHandler } from "@/lib/error-handler";
import { getServerSession } from "@/lib/server-session";
import { getGroupData } from "../groupData";

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const groupData = await getGroupData(id);
    if (!groupData) throw new Error("Group not found");
    return Response.json({
      status: "success",
      data: groupData,
    });
  } catch (error) {
    const errMessage = APIErrorHandler(error);
    return error instanceof AuthError
      ? Response.json({ status: "unauthenticated", error: error.message })
      : Response.json({
          status: "error",
          error: errMessage,
        });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const json = await req.json();
  const { id } = params;
  try {
    const { user, error } = await getServerSession();
    if (!user) throw new AuthError(error);
    const groupData = await getGroupData(id);
    if (!groupData) throw new Error("Group not found");
    if (json.members) {
      const members = json.members;
      const membersToAdd = members.filter(
        (member: { id: string }) =>
          !groupData.members.some(
            (groupMember: { id: string }) => groupMember.id === member.id
          )
      );
      const membersToRemove = groupData.members.filter(
        (groupMember: { id: string }) =>
          !members.some(
            (member: { id: string }) => member.id === groupMember.id
          )
      );
      const updatedGroup = await db.group.update({
        where: { id: id },
        data: {
          name: json.name,
          members: {
            connect: membersToAdd,
            disconnect: membersToRemove,
          },
        },
      });
      return Response.json({
        status: "success",
        data: updatedGroup,
      });
    }
  } catch (error) {
    const errMessage = APIErrorHandler(error);
    return error instanceof AuthError
      ? Response.json({ status: "unauthenticated", error: error.message })
      : Response.json({
          status: "error",
          error: errMessage,
        });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const { user, error } = await getServerSession();
    if (!user) throw new AuthError(error);
    const { id } = params;
    const groupData = await getGroupData(id);
    if (!groupData) throw new Error("Group not found");
    const deletedGroup = await db.group.delete({
      where: {
        id: id,
        members: {
          some: {
            id: user.id,
          },
        },
      },
    });
    return Response.json({
      status: "success",
      data: deletedGroup,
    });
  } catch (error) {
    const errMessage = APIErrorHandler(error);
    return error instanceof AuthError
      ? Response.json({ status: "unauthenticated", error: error.message })
      : Response.json({
          status: "error",
          error: errMessage,
        });
  }
};
