import { getGroup } from "@/app/api/group/groupData";
import { Button, buttonVariants } from "@/components/ui/button";
import { CreateGroupForm } from "./createGroupForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import Link from "next/link";

const Groups = async () => {
  try {
    const groups = await getGroup();
    return (
      <section className="grid gap-5">
        <div className="flex justify-between items-center">
          <h1>Groups</h1>

          <CreateGroupForm />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 ">
          {groups.map((group) => {
            return (
              <Card
                key={group.id}
                className="hover:ring-primary ring-primary/0 transition-shadow ring-1"
              >
                <CardHeader>
                  <CardTitle>
                    {group.name.slice(0, 8)}
                    {group.name.length > 8 && "..."}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p>
                    Created At ::{" "}
                    {group.createdAt.toLocaleString().split(",")[0]}
                  </p>
                  <div className="flex justify-end gap-2">
                    <Link
                      className={buttonVariants()}
                      href={`/dashboard/groups/${group.id}`}
                    >
                      View
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await db.group.delete({
                          where: {
                            id: group.id,
                          },
                        });
                        revalidatePath("/dashboard/groups");
                      }}
                    >
                      <Button>Delete (testing)</Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    );
  } catch (error) {
    return <h1>error</h1>;
  }
};
export default Groups;
