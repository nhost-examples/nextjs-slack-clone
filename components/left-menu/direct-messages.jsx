import { auth } from "utils/nhost";
import { useSubscription } from "@apollo/client";
import { parseISO, differenceInSeconds } from "date-fns";
import gql from "graphql-tag";

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
        <div>
          <svg
            className="fill-current h-4 w-4 opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2v4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
          </svg>
        </div>
      </div>

      {users.map((user) => {
        const me = user.id === auth.getClaim("x-hasura-user-id");

        const seconds = differenceInSeconds(now, parseISO(user.last_seen_at));

        const online = seconds < 30;
        return (
          <div key={user.id} className="flex items-center mb-3 px-4">
            {online ? (
              <span className="bg-green-600 rounded-full block w-2 h-2 mr-2"></span>
            ) : (
              <span className="bg-red-400 rounded-full block w-2 h-2 mr-2"></span>
            )}
            <span className="text-white opacity-75">
              {user.display_name}{" "}
              {me && <span className="text-grey text-sm">(you)</span>}
            </span>
          </div>
        );
      })}
    </div>
  );
}
