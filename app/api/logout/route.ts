import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export const GET = async (req: Request) => {
  const Cookie = cookies();
  Cookie.delete("token");
  redirect("/login");
};
