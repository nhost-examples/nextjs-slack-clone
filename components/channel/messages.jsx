import { useEffect, useRef } from "react";
import { parseISO, format } from "date-fns";

export function Message({ message }) {
  const timestamp = format(parseISO(message.created_at), "HH:mm");

  return (
    <div className="flex items-start mb-4 text-sm">
      <img src={message.user.avatar_url} className="w-10 h-10 rounded mr-3" />
      <div className="flex-1 overflow-hidden">
        <div>
          <span className="font-bold mr-2">{message.user.display_name}</span>
          <span className="text-grey text-xs">{timestamp}</span>
        </div>
        <p className="text-black leading-normal">{message.message}</p>
      </div>
    </div>
  );
}

export function ChannelMessages({ messages }) {
  const messagesEndRef = useRef(null);

  messages = messages.reverse();

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="px-6 py-4 flex-1 overflow-y-scroll">
      {messages.map((message) => {
        return <Message key={message.id} message={message} />;
      })}
      <div ref={messagesEndRef} style={{ height: 0 }} />
    </div>
  );
}
