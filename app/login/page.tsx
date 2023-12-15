import { getServerSession } from "@/lib/server-session";
import LoginForm from "./login-form";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowBigLeft, ArrowLeft, Home } from "lucide-react";
export default async function Login() {
  const { user, error } = await getServerSession();
  if (user) {
    redirect("/");
  }
  return (
    <main className="relative min-h-screen grid place-items-center px-4">
      <div className="absolute top-0 inset-x-0 pt-8 px-4 md:px-20">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft />
          Go Back
        </Link>
      </div>
      <LoginForm />
    </main>
  );
}
