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
    const apiKey = ""; // Input your api key here

    const client = createClient(apiKey, API_REGIONS.SG);
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
