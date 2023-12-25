import { permanentRedirect } from "next/navigation";

export default async function Page() {
  permanentRedirect("/dashboard/groups");
}
