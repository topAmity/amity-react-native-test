import { StatusBar } from 'expo-status-bar';
import {useEffect,useState} from 'react'
import { StyleSheet, Text, View } from 'react-native';
import {
  createQuery,
  runQuery,
  getChannel,
  createImage,
  updatePost,
  getPost,
  createVideo,
  createMessage,
  ContentFeedType,
  queryMessages,
  liveMessage,
  liveMessages,
  queryChannels,
  observeFile,
  queryChannelMembers,
  liveChannels
} from "@amityco/ts-sdk";
import AuthProvider from "./auth";

export default function App() {
  const [data, setMessage] = useState<Amity.LiveObject<Amity.Message>>();
  const [messagesData, setMessagesData] = useState<Amity.LiveCollection<Amity.Message>>();
  const [channelData, setChannelData] = useState<Amity.LiveCollection<Amity.Channel>>();
  // console.log('channelData: ', channelData);
  const [isConnected, setIsConnected] = useState(false)
  // const { data: channels = [], onNextPage, hasNextPage, loading, error } = channelData ?? {};
  const { data: messages = [], onNextPage, hasNextPage, loading, error } = messagesData ?? {};
  // console.log('messages: ', messages);
  // console.log('hasNextPage: ', hasNextPage);
  // console.log('onNextPage: ', onNextPage);
  // console.log('communities: ', communities);
  console.log('messages test: ', messagesData);
 

  useEffect(() => {
  
    
  }, [messagesData]);

  function clickNextPage(){
    if(onNextPage){ 
        onNextPage()
      }
 
  }
  function queryChannel() {
  
    liveChannels({limit:10,membership:'member',sortBy:'lastActivity'},setChannelData)
  }
  // let unSubFunc: any;
  const [unSubFunc, setUnSubFunc] = useState<any>()

  function queryLiveMessages() {
    // const response = liveMessages({ subChannelId:"641c81a171dfbce61605d9fd",limit:5 }, setMessagesData)
    const response =liveMessages({ subChannelId:"641c7b580984eb566861e4e3",limit:5 }, (value)=>{
      console.log('value: ', value);
      
    })
    
    // console.log('response: ', response);
    setUnSubFunc(()=>response)
    // console.log('unSubFunc1: ', unSubFunc);

  }

   function unSubLiveMessages() {

    // liveMessages({ subChannelId:"633ecbfce0c43d1cad00d65a" }, setMessagesData)
    try {
      unSubFunc()
      // setMessagesData({})
    } catch (error) {
      console.log('error: ', error);
      
    }
    

  }
  // useEffect(() =>  liveMessages({ subChannelId:"YOUR_CHANNEL_ID" }, setMessagesData)), [subChannelId])
 
  const editPost =async ()=>{
  
    // const data: any = {data: {text:'hiii'}}

    const query = createQuery(updatePost, '63872c8f24fbe0b358515779', {
      data: {
        text: 'hello! edit',
      },
    
    });
    
    runQuery(query, ({ data: post, ...options }) => console.log(post, options));
  }
  const queryPost =async ()=>{
  
    // const data: any = {data: {text:'hiii'}}

    const query = createQuery(getPost, '63872c8f24fbe0b358515779');
    
    runQuery(query, ({ data: post, ...options }) => console.log(post, options));
  }
  const Post =async ()=>{
  
    // const data: any = {data: {text:'hiii'}}

    const query = createQuery(getPost, '63872c8f24fbe0b358515779');
    
    runQuery(query, ({ data: post, ...options }) => console.log(post, options));
  }
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    const data = new FormData();
    data.append("files", event.target.files[0]);

    const query = createQuery(createImage, data);

    runQuery(query, (result) => console.log("===result=====", result));
    const createVideoQuery = createQuery(createVideo, data, ContentFeedType.MESSAGE);

// 3. run create video query
runQuery(createVideoQuery, ({ data: file, loading }) => {
  // wait until loading success
  if (loading) return;

  // 4. got video file ID
  const { fileId } = file[0];

  // 5. create `createMessage` query by setting fileId to video file ID.
  const createMessageQuery = createQuery(createMessage, {
    subChannelId: "641c7bced0a2aa3fe7228e60",
    dataType: 'video',
    fileId,
  });

  // 6. run create message query
  runQuery(createMessageQuery, ({ data: message }) => console.log('test message',message));

});
  };
 
   const [isVideoCreated, setIsVideoCreated] = useState<any>()

  const getMessage=()=>{
    const query = createQuery(queryMessages, { subChannelId: "633d63d1f6f45e00d9deeab2" });
    runQuery(query, ({ data: messages, ...options }) => {
      console.log('messages: ', messages);
  
    });

  }
  const queryChannelsByMember = () => {
    const query = createQuery(queryChannels, {
      membership: 'member',
      sortBy:'lastActivity'
    });

    runQuery(query, ({data: channels, ...option}) => {
      console.log('channels: ', channels);
     
    });
    
  };
const getImage=()=>{

    observeFile('604039de47464af69ce55efa292d314e', ({ data }) => {
      console.log('data: ', data);
        
      })
   
}
const getChannelMember=()=>{
  const query = createQuery(queryChannelMembers, {
    channelId: 'A-comment-12-A-communitie-6-A-message-3',
  });


  runQuery(query, ({ data: members }) => {
    console.log('members: ', members);
   
   
     
  });
}
const uploadVideo =(event: React.ChangeEvent<HTMLInputElement>)=>{
  if (!event.target.files) {
    return;
  }

  const data = new FormData();
  data.append("files", event.target.files[0]);



  const query = createQuery(createVideo, data, ContentFeedType.POST, (percent) => console.log("UploadProgress %: ", percent));

  runQuery(query, ({ data }) => console.log('test message',data));

}

const queryChatMessages=()=>{

  const query = createQuery(queryMessages, { subChannelId: "641c7d758a4c5a6b256aa852" });

  runQuery(query, ({ data: messages, ...options }) => console.log('messagesss',messages));
}
const createTextTest =()=>{
  console.log('createText: ', createTextTest);
  const query = createQuery(createMessage, {
    subChannelId: '641c7d758a4c5a6b256aa852',
    dataType: 'text',
    data: {
      text: 'hello world',
    },
  
  });
  
  runQuery(query, ({ data: message, ...options }) => console.log('text', message));
}
  // useEffect(() => {
  //   getMessage()
  // }, [isVideoCreated])
  
  return (
    <View style={styles.container}>
     <AuthProvider>
        <button onClick={() => queryChannel()}>test liveChannels</button>
        <button onClick={() => queryLiveMessages()}>test liveMessages</button>
        <button onClick={() => queryChannelsByMember()}>test channel Membership</button>
        <button onClick={() => editPost()}>test post</button>
        <button onClick={() => queryPost()}>get post</button>
        <button onClick={() => getMessage()}>get Messages</button>
        <button onClick={() => getImage()}>get Image</button>
        <button onClick={() => getChannelMember()}>get Channel Member</button>
        <button onClick={() => queryChatMessages()}>get Chat Messages</button>
        <button onClick={()=>clickNextPage()}>Next Page</button>
        <button onClick={unSubLiveMessages}>Unsubscribe</button>
        <button onClick={()=>createTextTest()}>Create message</button>
        <input type="file" name="file" onChange={changeHandler} />
        <input type="file" name="file" onChange={uploadVideo} />
      </AuthProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
