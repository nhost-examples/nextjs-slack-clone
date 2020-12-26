import { LeftMenuHeader } from "components/left-menu/left-menu-header";
import { Channels } from "components/left-menu/channels";
import { DirectMessages } from "components/left-menu/direct-messages";

export function LeftMenu() {
  return (
    <div className="bg-indigo-800 text-purple-lighter flex-none w-64 pb-6 hidden md:block">
      <LeftMenuHeader />
      <Channels />
      <DirectMessages />
    </div>
  );
}
