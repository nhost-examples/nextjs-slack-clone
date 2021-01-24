import { auth } from "utils/nhost";
import { useSubscription } from "@apollo/client";
import { parseISO, differenceInSeconds } from "date-fns";
import gql from "graphql-tag";
import Link from "next/link";

const GET_USERS = gql`
  subscription getUsers {
    users {
      id
      display_name
      last_seen_at
    }
  }
`;

export function DirectMessages() {
  const { loading, error, data } = useSubscription(GET_USERS);

  if (error) {
    console.error(error);
    return <div>Error ...</div>;
  }
  if (loading) {
    return <div>Loading ...</div>;
  }

  const { users } = data;
  const now = new Date();

  return (
    <div className="mb-8">
      <div className="px-4 mb-2 text-white flex justify-between items-center">
        <div className="opacity-75">Direct Messages</div>
      </div>

      {users.map((user) => {
        const me = user.id === auth.getClaim("x-hasura-user-id");

        const seconds = differenceInSeconds(now, parseISO(user.last_seen_at));

        const online = seconds < 30;

        return (
          <Link href={`/dm/${user.id}`} key={user.id}>
            <a className="flex items-center mb-3 px-4">
              {online ? (
                <span className="bg-green-600 rounded-full block w-2 h-2 mr-2"></span>
              ) : (
                <span className="bg-red-400 rounded-full block w-2 h-2 mr-2"></span>
              )}
              <span className="text-white opacity-75">
                {user.display_name}{" "}
                {me && <span className="text-grey text-sm">(you)</span>}
              </span>
            </a>
          </Link>
        );
      })}
    </div>
  );
}
