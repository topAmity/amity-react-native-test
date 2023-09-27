import {
  API_REGIONS,
  Client,
} from "@amityco/ts-sdk";
import { useEffect, useState } from "react";
interface IAuth {
  children?: any;
  onConnected?: any;
}

function AuthProvider({ children, onConnected }: IAuth) {
  const [sessionState, setSessionState] = useState('');
  console.log('sessionState:', sessionState)
  const apiKey = "b3babb0b3a89f4341d31dc1a01091edcd70f8de7b23d697f"; // Input your api key here
  const client: Amity.Client = Client.createClient(apiKey, 'sg', {
    apiEndpoint: { http: 'https://api.sg.amity.co' },
  });


  useEffect(() => {
    return Client.onSessionStateChange((state: Amity.SessionStates) => setSessionState(state));
  }, []);
 
  
  const handleConnect = async (userId: string, displayName: string) => {


    const response = await Client.login(
      {
        userId: userId,
        displayName: displayName, // optional
      },
      sessionHandler,
    );
    console.log('response:', response)
     Client.startUnreadSync();

  };
  useEffect(() => {
    setSessionState(client.sessionState)
  }, [client])

  const sessionHandler: Amity.SessionHandler = {
    sessionWillRenewAccessToken(renewal: Amity.AccessTokenRenewal) {
      // for details on other renewal methods check session handler
      renewal.renew();
    },
  };



  function login() {
   

    // console.log('client: ', client);
    console.log('API_REGIONS.SG: ', API_REGIONS.SG);
    // console.log("client: ", client.token?.accessToken);
    handleConnect("top", "top");

    // enableCache()y
  }

  function logClient(){
    console.log('client==:', client)
  }
  return (
    <div>
      <button onClick={login}> Login</button>
      <button onClick={logClient}> Log Client</button>
      {children}
    </div>
  );
}

export default AuthProvider;
