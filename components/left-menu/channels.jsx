import { useMutation, useSubscription } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import gql from "graphql-tag";
import slugify from "slugify";

const GET_CHANNELS = gql`
  subscription getChannels {
    channels {
      id
      name
    }
  }
`;

const CREATE_CHANNEL = gql`
  mutation createCannel($name: String!) {
    insert_channels_one(object: { name: $name }) {
      id
    }
  }
`;

export function Channels() {
  const router = useRouter();
  const { loading, error, data } = useSubscription(GET_CHANNELS);
  const [createChannel] = useMutation(CREATE_CHANNEL);

  async function onCreateChannel() {
    const name = prompt("Enter a value");

    const channelCreated = await createChannel({
      variables: {
        name: slugify(name, { lower: true }),
      },
    });

    router.push(`/channels/${channelCreated.data.insert_channels_one.id}`);
  }

  if (error) {
    console.error(error);
    return <div>Error ...</div>;
  }
  if (loading) {
    return <div>Loading ...</div>;
  }

  const { channels } = data;

  return (
    <div className="mb-8">
      <div className="px-4 mb-2 text-white flex justify-between items-center">
        <div className="opacity-75">Channels</div>
        <div onClick={onCreateChannel} className="cursor-pointer">
          <svg
            className="fill-current h-4 w-4 opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2v4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
          </svg>
        </div>
      </div>
      {channels.map((channel) => {
        return (
          <Link href={`/channels/${channel.id}`} key={channel.id}>
            <a className="block bg-teal-dark py-1 px-4 text-white">
              # {channel.name}
            </a>
          </Link>
        );
      })}
    </div>
  );
}
