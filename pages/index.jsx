import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

import { PrivateRoute } from "components/private-route";

const GET_REDIRECT_CHANNEL = gql`
  query {
    channels(order_by: { created_at: asc }, limit: 1) {
      id
    }
  }
`;

function Home() {
  const router = useRouter();
  const { loading, error, data } = useQuery(GET_REDIRECT_CHANNEL);

  if (error) {
    console.error(error);
    return <div>Error ...</div>;
  }
  if (loading && !data) {
    return <div>Loading ...</div>;
  }

  const { channels } = data;

  if (channels.length > 0) {
    const channel = channels[0];

    router.push(`/channels/${channel.id}`);
  }

  return <div>Dashboard, redirect to main channel...</div>;
}

export default PrivateRoute(Home);
