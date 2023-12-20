import { AuthError } from "@/errors/auth-error";
import { db } from "@/lib/db";
import { getServerSession } from "@/lib/server-session";

export const getExpense = async (expenseID: string) => {
  const { user, error } = await getServerSession();
  if (!user) {
    throw new AuthError(error);
  }
  const expense = await db.expense.findUnique({
    where: {
      id: expenseID,
      OR: [
        {
          payeeAndAmount: {
            some: {
              payee: {
                id: user.id,
              },
            },
          },
        },
        {
          payersAndAmounts: {
            some: {
              payer: {
                id: user.id,
              },
            },
          },
        },
      ],
    },
  });
  return expense;
};
