import {
  API_REGIONS,
  createClient,
  enableCache,
  connectClient,
} from "@amityco/ts-sdk";
interface IAuth {
  children?: any;
  onConnected?: any;
}

function AuthProvider({ children, onConnected }: IAuth) {
  const handleConnect = async (userId: string, displayName: string) => {
    const response = await connectClient({ userId, displayName });
    console.log("response: ", response);
  };
  function login() {
    const apiKey = "b3babb0b3a89f4341d31dc1a01091edcd70f8de7b23d697f"; // Input your api key here

    const client = createClient(apiKey, API_REGIONS.SG);
    console.log('API_REGIONS.SG: ', API_REGIONS.SG);
    console.log("client: ", client);

    enableCache();
    handleConnect("top", "top");
  }

  return (
    <div>
      <button onClick={login}> Login</button>
      {children}
    </div>
  );
}

export default AuthProvider;
