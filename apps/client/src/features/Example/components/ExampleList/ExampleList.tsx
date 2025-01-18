import { getSession } from "../../server/getSession";

export const ExampleList = async () => {
  const session = await getSession();

  console.log("session", session);

  return (
    <div>
      UserName: {session?.user?.name}
      UserEmail: {session?.user?.email}
    </div>
  );
};
