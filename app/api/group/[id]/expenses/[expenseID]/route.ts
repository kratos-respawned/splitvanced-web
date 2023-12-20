import { APIErrorHandler } from "@/lib/error-handler";
import { getExpense } from "../getExpense";
import { AuthError } from "@/errors/auth-error";

export const GET = async (
  req: Request,
  { params }: { params: { id: string; expenseID: string } }
) => {
  try {
    const expense = await getExpense(params.expenseID);
    if (!expense) throw new Error("Expense not found");
    return Response.json({
      status: "success",
      data: expense,
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
