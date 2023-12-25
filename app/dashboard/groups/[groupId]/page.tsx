import { getGroupData } from "@/app/api/group/groupData";

export default async function Group({
  params,
}: {
  params: { groupId: string };
}) {
  const { groupId } = params;
  const groupData = await getGroupData(groupId);
  if (!groupData) return <h1>Group Not Found</h1>;
  return (
    <>
      <h1>Group</h1>
    </>
  );
}
