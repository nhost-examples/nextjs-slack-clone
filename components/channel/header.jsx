import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

const DELETE_CHANNEL = gql`
  mutation deleteChannel($channel_id: uuid!) {
    delete_channels_by_pk(id: $channel_id) {
      id
    }
  }
`;

export function ChannelHeader({ channel }) {
  const router = useRouter();
  const [deleteChannel] = useMutation(DELETE_CHANNEL);

  async function handleChannelDelete() {
    await deleteChannel({
      variables: {
        channel_id: channel.id,
      },
    });

    router.push("/");
  }

  return (
    <div className="border-b flex px-6 py-2 items-center flex-none">
      <div className="flex flex-col">
        <h3 className="text-grey-darkest mb-1 font-extrabold">
          #{channel.name}{" "}
          <span
            className="text-red-600 cursor-pointer font-normal pl-4 text-xs"
            onClick={handleChannelDelete}
          >
            delete
          </span>
        </h3>
        <div className="text-grey-dark text-sm truncate">
          {channel.description}
        </div>
      </div>
      <div className="ml-auto hidden md:block">
        <div className="relative">
          <input
            type="search"
            placeholder="Search"
            className="appearance-none border border-grey rounded-lg pl-8 pr-4 py-2"
          />
          <div className="absolute top-0 left-0 pt-3 pl-3 flex items-center justify-center">
            <svg
              className="fill-current text-grey h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
