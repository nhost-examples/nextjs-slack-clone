import { useState } from "react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

const ADD_MESSAGE = gql`
  mutation addMessage($message: messages_insert_input!) {
    insert_messages_one(object: $message) {
      id
    }
  }
`;

export function ChannelAddMessage({ channel }) {
  const [message, setMessage] = useState("");

  const [addMessage] = useMutation(ADD_MESSAGE);

  async function handleSubmit(e) {
    e.preventDefault();

    await addMessage({
      variables: {
        message: {
          message,
          channel_id: channel.id,
        },
      },
    });

    setMessage("");
  }

  return (
    <div className="pb-6 px-4 flex-none">
      <form onSubmit={handleSubmit}>
        <div className="flex rounded-lg border-2 border-grey overflow-hidden">
          <span className="text-3xl text-grey border-r-2 border-grey p-2">
            <svg
              className="fill-current h-6 w-6 block"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M16 10c0 .553-.048 1-.601 1H11v4.399c0 .552-.447.601-1 .601-.553 0-1-.049-1-.601V11H4.601C4.049 11 4 10.553 4 10c0-.553.049-1 .601-1H9V4.601C9 4.048 9.447 4 10 4c.553 0 1 .048 1 .601V9h4.399c.553 0 .601.447.601 1z" />
            </svg>
          </span>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4"
            placeholder={`Message #${channel.name}`}
          />
        </div>
      </form>
    </div>
  );

  return <div>ChannelAddMessage</div>;
}
