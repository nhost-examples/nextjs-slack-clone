import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useMutation, useSubscription } from "@apollo/client";
import gql from "graphql-tag";
import crypto from "crypto-browserify";

import { auth } from "utils/nhost";
import { LeftMenu } from "components/left-menu/left-menu";
import { PrivateRoute } from "components/private-route";
import { ChannelHeader } from "components/channel/header";
import { ChannelMessages } from "components/channel/messages";
import { ChannelAddMessage } from "components/channel/add-message";

const GET_DM_CHANNEL = gql`
  subscription getDmChannel($dm_hash: String!) {
    channel: channels(where: { dm_hash: { _eq: $dm_hash } }) {
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

const CREATE_DM_CHANNEL = gql`
  mutation createDmChannel($channel: channels_insert_input!) {
    channel: insert_channels_one(object: $channel) {
      id
    }
  }
`;

function Channel({ userId }) {
  console.log({ userId });

  const dmUserIds = [auth.getClaim("x-hasura-user-id"), userId];
  const dmHash = crypto
    .createHash("sha256")
    .update(dmUserIds.sort().join(":"))
    .digest("hex");

  console.log({ dmHash });

  const { loading, error, data } = useSubscription(GET_DM_CHANNEL, {
    variables: {
      dm_hash: dmHash,
    },
  });

  if (error) {
    console.error(error);
    return <div>Error ... 2</div>;
  }

  console.log({ loading });
  console.log({ data });

  if (loading && !data) {
    return <div>Loading ...</div>;
  }

  const channel = data.channel[0];
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

function ChannelInit() {
  const router = useRouter();
  const { userId } = router.query;

  const [channelExists, setchannelExists] = useState(false);

  const [createDMChannel] = useMutation(CREATE_DM_CHANNEL);

  useEffect(async () => {
    console.log("use effect");
    if (!channelExists) {
      console.log("in !channelExists");
      console.log({ userId });

      if (!userId) return;

      const dmUserIds = [auth.getClaim("x-hasura-user-id"), userId];
      const dmHash = crypto
        .createHash("sha256")
        .update(dmUserIds.sort().join(":"))
        .digest("hex");

      try {
        console.log("creating dm channel...");
        await createDMChannel({
          variables: {
            channel: {
              name: dmHash,
              is_public: false,
              dm_hash: dmHash,
              channel_users: {
                data: [
                  { user_id: auth.getClaim("x-hasura-user-id") },
                  { user_id: userId },
                ],
              },
            },
          },
        });
        console.log("dm channel createde...");
      } catch (error) {
        // noop
        console.log("error creating dm channel");
        console.log({ error });
      }
      setchannelExists(true);
    }
  });

  if (!userId) {
    return <div>Next.js should solve this for us</div>;
  }

  if (!channelExists) {
    return <div>Creating DM channel...</div>;
  }

  return <Channel userId={userId} />;
}

export default PrivateRoute(ChannelInit);
