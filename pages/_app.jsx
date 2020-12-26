import { NhostAuthProvider } from "@nhost/react-auth";
import { NhostApolloProvider } from "@nhost/react-apollo";

import { auth } from "utils/nhost";
import "styles/tailwind.css";

import { UserOnlineHandler } from "components/user-online-handler";

function MyApp({ Component, pageProps }) {
  return (
    <NhostAuthProvider auth={auth}>
      <NhostApolloProvider
        auth={auth}
        gqlEndpoint={process.env.NEXT_PUBLIC_GRAPHQL_URL}
      >
        <UserOnlineHandler>
          <Component {...pageProps} />
        </UserOnlineHandler>
      </NhostApolloProvider>
    </NhostAuthProvider>
  );
}

export default MyApp;
