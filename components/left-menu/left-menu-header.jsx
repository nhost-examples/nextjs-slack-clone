import { useRouter } from "next/router";
import { useSubscription } from "@apollo/client";
import gql from "graphql-tag";

import { auth } from "utils/nhost";

const GET_SELF = gql`
  subscription getSelf($id: uuid!) {
    user: users_by_pk(id: $id) {
      id
      display_name
    }
  }
`;

export function LeftMenuHeader() {
  const router = useRouter();
  const { loading, error, data } = useSubscription(GET_SELF, {
    variables: {
      id: auth.getClaim("x-hasura-user-id"),
    },
  });

  const logout = () => {
    auth.logout();
    router.push("/login");
  };

  if (error) {
    console.error(error);
    return <div>Error ...</div>;
  }
  if (loading) {
    return <div>Loading ...</div>;
  }

  const { user } = data;

  return (
    <div className="text-white mb-2 mt-3 px-4 flex justify-between">
      <div className="flex-auto">
        <h1 className="font-semibold text-xl leading-tight mb-1 truncate">
          Nhost Slack Clone
        </h1>
        <div className="flex items-center mb-6">
          <span className="bg-green-600 rounded-full block w-2 h-2 mr-2"></span>
          <span className="text-white opacity-50 text-sm">
            {user.display_name} - [
            <span className="hover:underline cursor-pointer" onClick={logout}>
              log out
            </span>
            ]
          </span>
        </div>
      </div>
      <div>
        <svg
          className="h-6 w-6 fill-current text-white opacity-25"
          viewBox="0 0 20 20"
        >
          <path
            d="M14 8a4 4 0 1 0-8 0v7h8V8zM8.027 2.332A6.003 6.003 0 0 0 4 8v6l-3 2v1h18v-1l-3-2V8a6.003 6.003 0 0 0-4.027-5.668 2 2 0 1 0-3.945 0zM12 18a2 2 0 1 1-4 0h4z"
            fillRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}
