import { useRouter } from "next/router";
import { useSubscription } from "@apollo/client";
import gql from "graphql-tag";

import { LeftMenu } from "components/left-menu/left-menu";
import { PrivateRoute } from "components/private-route";
import { ChannelHeader } from "components/channel/header";
import { ChannelMessages } from "components/channel/messages";
import { ChannelAddMessage } from "components/channel/add-message";

const GET_CHANNEL = gql`
  subscription getChannel($channel_id: uuid!) {
    channel: channels_by_pk(id: $channel_id) {
      id
      name
      messages(order_by: { created_at: desc }, limit: 50) {
        id
        created_at
        message
        user {
          id
          display_name
          avatar_url
        }
      }
    }
  }
`;

function Channel() {
  const router = useRouter();

  const { loading, error, data } = useSubscription(GET_CHANNEL, {
    variables: {
      channel_id: router.query.channelId,
    },
  });

  if (error) {
    console.error(error);
    return <div>Error ...</div>;
  }
  if (loading && !data) {
    return <div>Loading ...</div>;
  }

  const { channel } = data;
  const { messages } = channel;

  return (
    <>
      <div className="font-sans antialiased h-screen flex">
        <LeftMenu />
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          <ChannelHeader channel={channel} />
          <ChannelMessages messages={messages} />
          <ChannelAddMessage channel={channel} />
        </div>
      </div>
    </>
  );
}
export default PrivateRoute(Channel);
