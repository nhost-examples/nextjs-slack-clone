import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

import { auth } from "utils/nhost";

const UPDATE_LAST_SEEN = gql`
  mutation updateLastSeen($user_id: uuid!, $last_seen_at: timestamptz!) {
    update_users(
      _set: { last_seen_at: $last_seen_at }
      where: { id: { _eq: $user_id } }
    ) {
      affected_rows
    }
  }
`;

export function UserOnlineHandler({ children }) {
  const [intervalStarted, setIntervalStarted] = useState(false);

  const [updateLasteSeen] = useMutation(UPDATE_LAST_SEEN, {
    context: {
      headers: {
        "x-hasura-role": "me",
      },
    },
  });

  async function intervalUpdateLasteSeen() {
    if (!auth.isAuthenticated()) {
      return;
    }

    const variables = {
      user_id: auth.getClaim("x-hasura-user-id"),
      last_seen_at: new Date().toISOString(),
    };

    try {
      await updateLasteSeen({
        variables,
      });
    } catch (error) {
      console.error(error);
      console.error("error..");
    }
  }

  useEffect(() => {
    if (!intervalStarted) {
      setInterval(intervalUpdateLasteSeen, 15000);
      setIntervalStarted(true);
    }
  });

  auth.onAuthStateChanged((data) => {
    if (!intervalStarted && data) {
      intervalUpdateLasteSeen();
    }
  });

  return children;
}
