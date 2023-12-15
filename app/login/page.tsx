import { getServerSession } from "@/lib/server-session";
import LoginForm from "./login-form";
import { redirect } from "next/navigation";
export default async function Login() {
  const { user, error } = await getServerSession();
  if (user) {
    redirect("/");
  }
  return (
    <main className=" min-h-screen grid place-items-center px-4">
      <LoginForm />
    </main>
  );
}
