import {
  API_REGIONS,
  createClient,
  enableCache,
  connectClient,
  Client,
  SubChannelRepository,
} from "@amityco/ts-sdk";
import { useState } from "react";
interface IAuth {
  children?: any;
  onConnected?: any;
}

function AuthProvider({ children, onConnected }: IAuth) {
  const [sessionState, setSessionState] = useState('');
  console.log('sessionState: ', sessionState);
  const handleConnect = async (userId: string, displayName: string) => {
    const response = await Client.login(
      {
        userId: userId,
        displayName: displayName, // optional
      },
      sessionHandler,
    );
     Client.startUnreadSync();

  };
  const sessionHandler: Amity.SessionHandler = {
    sessionWillRenewAccessToken(renewal: Amity.AccessTokenRenewal) {
      // for details on other renewal methods check session handler
      renewal.renew();
    },
  };
  function login() {
    const apiKey = "b3babb0b3a89f4341d31dc1a01091edcd70f8de7b23d697f"; // Input your api key here

    const client = Client.createClient(apiKey, API_REGIONS.SG)
    console.log('client: ', client);
    // console.log('client: ', client);
    console.log('API_REGIONS.SG: ', API_REGIONS.SG);
    // console.log("client: ", client.token?.accessToken);
    handleConnect("John", "John");
    // enableCache()y
  }

  return (
    <div>
      <button onClick={login}> Login</button>
      {children}
    </div>
  );
}

export default AuthProvider;
