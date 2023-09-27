import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
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
  liveChannels,
  getFile,
  subscribeTopic,
  getSubChannelTopic,
  getSubChannel,
  UserRepository,
  MessageRepository,
  SubChannelRepository,
  ChannelRepository,
  enableCache,
  FeedRepository,
  FileRepository,
  PostRepository,
  getPostTopic,
  getCommunityTopic,
  getUserTopic,
  SubscriptionLevels,
  CommentRepository,
  Client,
  MessageContentType,
  ReactionRepository,
  getCommentTopic,
  CommunityRepository,
} from "@amityco/ts-sdk";
import AuthProvider from "./auth";


const disposers: Amity.Unsubscriber[] = [];

export default function App() {

  const [messages, setMessages] = useState<Amity.Message[]>();
  console.log("messages: ", messages);
  const [messagesData, setMessagesData] =
    useState<Amity.LiveCollection<Amity.Message>>();
  const [channelData, setChannelData] =
    useState<Amity.LiveCollection<Amity.Channel>>();
  const [channelData2, setChannelData2] =
    useState<Amity.LiveCollection<Amity.Channel>>();
  // console.log('channelData: ', channelData);
  const [isConnected, setIsConnected] = useState(false);
  const {
    data: channels = [],
    onNextPage: onNextChannel,
  } = channelData ?? {};
  console.log('channels:', channels)
  const {
    data: channels2 = [],
    onNextPage: onNextChannel2,
  } = channelData2 ?? {};
  console.log('channels2:', channels2)

  const { data: messagesArr = [], onNextPage, hasNextPage, loading, error } = messagesData ?? {};
  console.log('messagesArr: ', messagesArr);
  // console.log('messages: ', messages);
  // console.log('hasNextPage: ', hasNextPage);
  // console.log('onNextPage: ', onNextPage);
  // console.log('communities: ', communities);
  console.log("messages test: ", messagesData);

  useEffect(() => { }, [messagesData]);

  function clickNextPage() {
    if (onNextPage) {
      onNextPage();
    }
  }

  function clickNextPageChannel() {
    if (onNextChannel) {
      onNextChannel();
    }
  }

  function clickNextPageChannel2() {
    if (onNextChannel2) {
      onNextChannel2();
    }
  }

  function queryChannel() {
    const unsubscribe = ChannelRepository.getChannels(
      {
        sortBy: "lastActivity",
        limit: 10,
        membership: "member",
        types: ['conversation']
      },
      (data) => {
        if (!loading) console.log("Channels=>: ", channels);

        setChannelData(data);
        // subscribeChannel({} as Amity.Channel);
      }
    );
  }

  function queryChannel2() {
    const unsubscribe = ChannelRepository.getChannels(
      {
        sortBy: "lastActivity",
        limit: 10,
        membership: "member",
        types: ['community']
      },
      (data) => {
        if (!loading) console.log("Channels=>: ", channels);
        setChannelData2(data);
        // setSubChannels(subChannels);
        // subscribeChannel({} as Amity.Channel);
      }
    );
  }
  // let unSubFunc: any;
  const [unSubFunc, setUnSubFunc] = useState<any>();
  const [unSubChannelFunc, setUnSubChannelFunc] = useState<any>();
  const [subChannelData, setSubChannelData] = useState<Amity.SubChannel>();
  const [subChannelData2, setSubChannelData2] = useState<Amity.SubChannel>();
  console.log("subChannelData: ", subChannelData);
  const disposersMessages: Amity.Unsubscriber[] = [];

  const subscribeSubChannel = (subChannel: Amity.SubChannel) =>
    disposers.push(
      subscribeTopic(getSubChannelTopic(subChannel), (error) => {
        if (error) {
          console.log("error: ", error);
          console.log("throw:");
          // throw error
        }
      })
    );

  function queryLiveMessages() {
    // const response = liveMessages({ subChannelId:"641c81a171dfbce61605d9fd",limit:5 }, setMessagesData)
    const unsubscribe = SubChannelRepository.getSubChannel(
      "634e7de3568c245ae63158aa",
      ({ data: subChannel, loading, error, }) => {
        console.log("subChannel: ", subChannel);
        setSubChannelData(subChannel);
      }
    );
  }
  const [messageNext, setMessageNext] = useState()
  function queryLiveMessages2() {
    // const response = liveMessages({ subChannelId:"641c81a171dfbce61605d9fd",limit:5 }, setMessagesData)
    const unsubscribe = SubChannelRepository.getSubChannel(
      "634e7de3568c245ae63158aa",
      ({ data: subChannel, loading, error }) => {
        console.log("subChannel: ", subChannel);
        setSubChannelData2(subChannel);
      }
    );
  }


  useEffect(() => {
    if (subChannelData) {
      console.log("pass this=====");
      const unsubscribe = MessageRepository.getMessages(
        { subChannelId: "634e7de3568c245ae63158aa", limit: 10, includeDeleted: true },
        (res) => {
          setMessagesData(res);
          try {
            subscribeSubChannel(subChannelData as Amity.SubChannel);
          } catch (error) {
            console.log("error catch: ", error);
          }
        }
      );
      setUnSubFunc(() => unsubscribe)
      disposersMessages.push(unsubscribe);
    }
  }, [subChannelData]);
  useEffect(() => {
    if (subChannelData2) {
      console.log("pass this=====");
      const unsubscribe = MessageRepository.getMessages(
        { subChannelId: "634e7de3568c245ae63158aa", limit: 10 },
        (res) => {
          console.log("error: ", error);
          console.log("response2: ", res);
          // setMessages(messages);
          // if(!loading){
          //   console.log('not loading==>',messages)
          // }
          try {
            subscribeSubChannel(subChannelData as Amity.SubChannel);
          } catch (error) {
            console.log("error catch: ", error);
          }
        }
      );
      disposersMessages.push(unsubscribe);
    }
  }, [subChannelData2]);

  function unSubLiveMessages() {
    // liveMessages({ subChannelId:"633ecbfce0c43d1cad00d65a" }, setMessagesData)
    try {
      console.log("unSubFunc: ", unSubFunc);
      unSubFunc();

      // setMessagesData({})
    } catch (error) {
      console.log("error: ", error);
    }
  }

  function unSubLiveChannels() {
    try {
      unSubChannelFunc();
      console.log("unSubChannelFunc: ", unSubChannelFunc);
      // setMessagesData({})
    } catch (error) {
      console.log("error: ", error);
    }
  }
  // useEffect(() =>  liveMessages({ subChannelId:"YOUR_CHANNEL_ID" }, setMessagesData)), [subChannelId])

  const editPost = async () => {
    // const data: any = {data: {text:'hiii'}}

    const query = createQuery(updatePost, "63872c8f24fbe0b358515779", {
      data: {
        text: "hello! edit",
      },
    });

    runQuery(query, ({ data: post, ...options }) => console.log(post, options));
  };
  const queryPost = async () => {
    // const data: any = {data: {text:'hiii'}}

    const query = createQuery(getPost, "63872c8f24fbe0b358515779");

    runQuery(query, ({ data: post, ...options }) => console.log(post, options));
  };
  const Post = async () => {
    // const data: any = {data: {text:'hiii'}}

    const query = createQuery(getPost, "63872c8f24fbe0b358515779");

    runQuery(query, ({ data: post, ...options }) => console.log(post, options));
  };
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    const data = new FormData();
    data.append("files", event.target.files[0]);

    const query = createQuery(createImage, data);

    runQuery(query, (result) => console.log("===result=====", result));
    const createVideoQuery = createQuery(
      createVideo,
      data,
      ContentFeedType.MESSAGE
    );

    // 3. run create video query
    runQuery(createVideoQuery, ({ data: file, loading }) => {
      // wait until loading success
      if (loading) return;

      // 4. got video file ID
      const { fileId } = file[0];

      // 5. create `createMessage` query by setting fileId to video file ID.
      const createMessageQuery = createQuery(createMessage, {
        subChannelId: "641c7bced0a2aa3fe7228e60",
        dataType: "video",
        fileId,
      });

      // 6. run create message query
      runQuery(createMessageQuery, ({ data: message }) =>
        console.log("test message", message)
      );
    });
  };

  const [isVideoCreated, setIsVideoCreated] = useState<any>();

  const queryChannelsByMember = () => {
    const query = createQuery(queryChannels, {
      membership: "member",
      sortBy: "lastActivity",
    });

    runQuery(query, ({ data: channels, ...option }) => {
      console.log("channels: ", channels);
    });
  };
  const getImage = () => {
    observeFile("604039de47464af69ce55efa292d314e", ({ data }) => {
      console.log("data: ", data);
    });
  };
  const getChannelMember = () => {
    const unsubscribe = ChannelRepository.Membership.getMembers(
      { channelId: "641c7c3eac53901fcc69bdb4", search: "top" },
      ({ data: members, onNextPage, hasNextPage, loading, error }) => {
        console.log("members55: ", members);

        /*
         * this is only required if you want real time updates for each
         * member in the collection
         */
      }
    );
  };
  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    const data = new FormData();
    data.append("files", event.target.files[0]);

    const { data: file } = await FileRepository.uploadImage(
      data,
      (percent) => {
        console.log('percent:', percent)

      }
    );
    console.log('file:', file)

  };
  const createVideoMessage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    const data = new FormData();
    data.append("files", event.target.files[0]);

    const { data: file } = await FileRepository.uploadVideo(
      data, 'message',(percent)=> console.log(percent)
    );
    console.log('file:', file)
    const { fileId } = file[0];
    if (fileId) {
      const videoMessage = {
        subChannelId: '65117b4707c4195c355d4b6e',
        dataType: MessageContentType.VIDEO,
        fileId,
      };
      // 3. run create message query
      const { data: message } = await MessageRepository.createMessage(videoMessage);
      console.log('message:', message)
    }


  };

  const queryChatMessages = () => {
    const query = createQuery(queryMessages, {
      subChannelId: "6421a2f271dfbc6449a99886",
    });

    runQuery(query, ({ data: messages, ...options }) =>
      console.log("messagesss", messages)
    );
  };
  const createTextTest = async () => {
    const textMessage = {
      subChannelId: "648acc4dcfb9bca53e27f989",
      dataType: MessageContentType.TEXT,
      data: {
        text: "hello world 2",
      },
      tags: ["tag1", "tag2"],
      metadata: {
        data: "anything",
      },
    };

    const { data: message } = await MessageRepository.createMessage(
      textMessage
    );
    console.log("message: ", message);

    return message;
  };
  const getUserList = () => {
    const unsub = UserRepository.getUsers(
      { displayName: "top" },
      ({ data: users }) => console.log(users)
    );
  };
  async function queryGlobalFeed() {
    const data = await FeedRepository.queryGlobalFeed({
      page: { after: 0, limit: 10 },
    });
    console.log("error: ", error);
    console.log("posts: ", data);

    return data;
  }
  // useEffect(() => {
  //   getMessage()
  // }, [isVideoCreated])
  const changeHandler2 = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    const data = new FormData();
    data.append("files", event.target.files[0]);

    const { data: image } = await FileRepository.uploadFile(data);
    console.log("image: ", image);

    return image;
  };
  const [postObject, setPostObject] = useState<any>();
  const { onNextPage: onPostNextPage } = postObject ?? {};
  console.log("postObject: ", postObject);
  const [unSubscribePost, setUnSubscribePost] = useState<any>();
  const subscribePostTopic = (targetType: string, targetId: string) => {
    if (targetType === "user") {
      const user = {} as Amity.User; // use getUser to get user by targetId
      disposers.push(
        subscribeTopic(getUserTopic(user, SubscriptionLevels.POST), () => {
          // use callback to handle errors with event subscription
        })
      );
      return;
    }

    if (targetType === "community") {
      // use getCommunity to get community by targetId
      // const community = {} as Amity.Community;
      const unsubscribe = CommunityRepository.getCommunity(targetId, (data) => {
        console.log('data community: ', data.data);
        if (data.data) {
          subscribeTopic(
            getCommunityTopic(data.data, SubscriptionLevels.POST),

          );
        }
        // subscribeTopic(
        //   getCommunityTopic(data.data, SubscriptionLevels.POST),
        //   () => {
        //     // use callback to handle errors with event subscription
        //   }
        // );
      });
    }
  };
  const getPosts = useCallback(() => {
    const unsubscribe = PostRepository.getPosts(
      {
        targetId: "a1728810d2b7cbffcc4977121594e20f",
        targetType: "community",
        limit: 10,
      },
      (data) => {
        console.log("data: ", data);
        subscribePostTopic("community", "a1728810d2b7cbffcc4977121594e20f");
        setPostObject(data);
      }
    );
  }, []);

  const nextPostCommunity = () => {
    onPostNextPage && onPostNextPage();
  };
  const onRefresh = () => {
    console.log("unSubPost: ", unSubscribePost);
    const unsubscribe = getPosts();
  };
  const [postCollection, setPostCollection] = useState<Amity.Post<any>>();

  const getPost = () => {
    const unsubscribePost = PostRepository.getPost(
      "64746ec04815205ae149bdd3",
      (value) => {
        const { data, loading, error } = value;

        if (data) {
          console.log("data: ", data);
          /*
           * This step is important if you wish to recieve real time updates
           * Here, you are letting the server know that you wish to recieve real time
           * updates regarding this post
           */
          subscribeTopic(getPostTopic(data));
        }
      }
    );
  };
  // useEffect(() => {
  //   if (postCollection) {
  //     subscribeTopic(getPostTopic(postCollection));
  //   }
  // }, [postCollection]);
  const disposers: Amity.Unsubscriber[] = [];
  let isSubscribed = false;
  const subscribeCommentTopic = (
    referenceId: string,
    targetType: "user" | "community"
  ) => {
    if (isSubscribed) return;

    if (targetType === "user") {
      const user = {} as Amity.User; // use getUser to get user by targetId
      disposers.push(
        subscribeTopic(getUserTopic(user, SubscriptionLevels.COMMENT), () => {
          // use callback to handle errors with event subscription
        })
      );
      isSubscribed = true;
      return;
    }

    if (targetType === "community") {
      const community = {} as Amity.Community; // use getCommunity to get community by targetId
      disposers.push(
        subscribeTopic(
          getCommunityTopic(community, SubscriptionLevels.COMMENT),
          () => {
            // use callback to handle errors with event subscription
          }
        )
      );
      isSubscribed = true;
    }
  };

  const [nextPageFunc, setNextPageFunc] = useState<() => void>();
  const getCommentData = () => {
    const getCommentsParams: Amity.CommentLiveCollection = {
      referenceType: "post",
      referenceId: "650ff88af803fa63ebc215bc",
      dataTypes: { values: ["text", "image"], matchType: "any" },
      limit: 20
    };

    let addedComment = false;
    const unsubscribe = CommentRepository.getComments(
      getCommentsParams,
      (data) => {
        console.log("info comment: 555 ", data);
        // console.log(
        //   "received data, comment ids: ",
        //   info.data.map((c) => c.commentId)
        // );
        // setNextPageFunc(() => info.onNextPage);
        // add a reply to the first comment
        subscribeCommentTopic('64d158f6000d6e1d90062de1', 'community');
      }
    );
  };
  const getCommentByID = () => {

    let addedComment = false;
    const unsubscribe = CommentRepository.getComment(
      '64b67d09ee61d8414260dfc6',

      ({ data: comment }) => {
        console.log('comment:', comment)

        // add a reply to the first comment
        // subscribeCommentTopic('a1728810d2b7cbffcc4977121594e20f', 'community');
      }
    );
  };

  const reactionQuery = () => {
    const unsub = ReactionRepository.getReactions(
      {
        referenceType: "comment",
        referenceId: "64b67d09ee61d8414260dfc6",// your commentID
      },
      ({ data: reactions }) => console.log(reactions)
    );


  };
  const [commentCollection, setCommentCollection] =
    useState<Amity.LiveCollection<Amity.Comment<any>>>();

  const { data: comments, onNextPage: OnNextComment } = commentCollection ?? {};
  const getReplyComment = () => {
    const getCommentsParams: Amity.CommentLiveCollection = {
      referenceType: "post",
      referenceId: "650ff88af803fa63ebc215bc", // post ID
      dataTypes: { values: ["text", "image"], matchType: "any" },
      parentId: "53DC30FA-308E-40C4-988B-8EBAD976A673",// parent comment ID
      limit: 10
    };

    const unsubscribe = CommentRepository.getComments(
      getCommentsParams,
      (info) => {
        setCommentCollection(info)
        console.log("info=>: ", info);
      }
    );
  };

  const nextCommentPage = () => {
    OnNextComment && OnNextComment()
  }
  const addReplyComment = () => {
    const referenceType: Amity.CommentReferenceType = "post";
    const newCommentParams = {
      data: { text: "top kub 2" },
      referenceId: "64746ec04815205ae149bdd3",
      referenceType,
      parentId: '64e729cacd40dc29db44e404'
    };
    CommentRepository.createComment(newCommentParams);
  };
  const nextPageComment = () => {
    if (nextPageFunc) {
      console.log("nextPageFunc: ", nextPageFunc);
      nextPageFunc();
    }
  };
  const getReplyCommentData = async () => {
    const comments = await CommentRepository.getCommentByIds([
      '64b67d09ee61d8414260dfc6'
    ]);
    console.log("comments: ", comments);
  };
  async function addCommentReaction() {
    const isPostReactionAdded = await ReactionRepository.addReaction(
      "comment",
      "64b67d09ee61d8414260dfc6",
      "sad"
    );
    console.log("isPostReactionAdded: ", isPostReactionAdded);

    return isPostReactionAdded;
  }
  // const [postCollection, setPostCollection] = useState<Amity.Post<any>>();

  // useEffect(() => {
  //     const unsubscribe = getPosts()
  //     unsubscribe()
  // }, [getPosts])

  // const onRefresh = useCallback(() => {
  //     console.log("onRefresh")
  //     const unsubscribe = getPosts()
  //     unsubscribe()
  // }, [getPosts]);
  async function createSubChannel() {
    const newSubChannel = {
      channelId: "648991bb60996d0fbb7e53a9",
      displayName: "my sub channel",
    };

    const { data: subChannel } = await SubChannelRepository.createSubChannel(
      newSubChannel
    );
    console.log("subChannel: ", subChannel);

    return subChannel;
  }
  const deletePostById = async () => {
    try {
      await PostRepository.deletePost("6478d43c31acbcaafd369d58");
    } catch (error) {
      throw error;
    }
  };
  const deleteSubChannelById = async () => {
    try {
      const hardDeltedSubChannel = await SubChannelRepository.deleteSubChannel('648aba1451df123ea0921580', true);
      console.log('hardDeltedSubChannel:', hardDeltedSubChannel)
    } catch (error) {
      throw error;
    }
  };
  const getSubChannelData = () => {
    SubChannelRepository.getSubChannels(
      { channelId: "648991bb60996d0fbb7e53a9" },
      ({ data: subChannel, loading, error }) => {
        console.log("subChannel: ", subChannel);
      }
    );
  };
  const startSync = async () => {
    const res = await Client.startUnreadSync();
    console.log('res:', res)

  };
  const stopSync = async () => {
    const res = await Client.stopUnreadSyncing();
    console.log("res: ", res);
  };
  const [sessionState, setSessionState] = useState("");

  const checkSessionState = async () => {
    Client.onSessionStateChange((state: Amity.SessionStates) =>
      console.log("state", state)
    );

    console.log("pass");
  };

  const getFileDetail = async () => {
    const { data: file } = await FileRepository.getFile(
      "649ad09920d6de18d3192d7b"
    );
    console.log("file: ", file);
  };
  async function getVideoImageThumbnail() {
    const data = await FileRepository.fileUrlWithSize(
      "649ad09920d6de18d3192d7b",
      "medium"
    );
    console.log("5555: ", data);
  }

  const startRead = async () => {
    const res = await SubChannelRepository.startReading("634e7de3568c245ae63158aa");
    console.log('res start read:', res)
  };

  const searchCommunity = () => {
    // const unsubscribe = CommunityRepository.getCommunities(
    //   { membership: 'notMember', limit: 10, displayName: 'te'},
    //   (data) => {
    //     console.log('data: ', data);
    //   }
    // );
    const unsubscribe2 = UserRepository.searchUserByDisplayName(
      { displayName: null },
      ({ data }) => {
        console.log("data55: ", data);
      }
    );
  };
  const searchUser1 = () => {
    // const unsubscribe = CommunityRepository.getCommunities(
    //   { membership: 'notMember', limit: 10, displayName: 'te'},
    //   (data) => {
    //     console.log('data: ', data);
    //   }
    // );
    const unsubscribe = UserRepository.getUsers(
      { displayName: "" },
      (data) => {
        console.log("data1: ", data);
      }
    );
  };
  const searchUser2 = () => {
    // const unsubscribe = CommunityRepository.getCommunities(
    //   { membership: 'notMember', limit: 10, displayName: 'te'},
    //   (data) => {
    //     console.log('data: ', data);
    //   }
    // );
    const unsubscribe2 = UserRepository.getUsers(
      { displayName: "Joh" },
      (data) => {
        console.log("data2: ", data);
      }
    );
  };
  const searchUser3 = () => {
    // const unsubscribe = CommunityRepository.getCommunities(
    //   { membership: 'notMember', limit: 10, displayName: 'te'},
    //   (data) => {
    //     console.log('data: ', data);
    //   }
    // );
    const unsubscribe = UserRepository.searchUserByDisplayName(
      { displayName: "Joh" },
      (data) => {
        console.log("data1: ", data);
      }
    );
  };
  const [usersObject, setUsersObject] = useState<Amity.LiveCollection<Amity.User>>();
  const { data: userArr = [], onNextPage: onUserNextPage } = usersObject ?? {};
  console.log('userArr:', userArr)


  const queryAccounts = () => {

    const unsubscribe = UserRepository.getUsers(
      { displayName: '' },
      (data) => {
        setUsersObject(data)

      }
    );
    return (() => unsubscribe())

  };
  const handleUserNextPage = () => {
    if (onUserNextPage) onUserNextPage()
  }
  async function createChannel() {
    const newChannel = {
      type: 'conversation' as Amity.ChannelType,
      userIds: ['top', 'John'],
    };

    const { data: channel } = await ChannelRepository.createChannel(newChannel);
    console.log('channel:', channel)

  }

  async function addMessageReaction() {
    const isMessageReactionAdded = await ReactionRepository.addReaction(
      'message',
      '64dcb4e32fc55424ef7107c2',
      'like',
    );

    console.log('isMessageReactionAdded:', isMessageReactionAdded)
  }
  return (
    <View style={styles.container}>
      <AuthProvider>
        <button onClick={() => queryChannel()}>test liveChannels</button>
        <button onClick={() => queryChannel2()}>test liveChannels 2</button>
        <button onClick={() => clickNextPageChannel()}>test Channel Next</button>
        <button onClick={() => clickNextPageChannel2()}>test Channel Next 2</button>
        <button onClick={() => queryLiveMessages()}>test liveMessages</button>
        <button onClick={() => queryLiveMessages2()}>test liveMessages2</button>
        <button onClick={() => queryChannelsByMember()}>
          test channel Membership
        </button>
        <button onClick={() => editPost()}>test post</button>
        <button onClick={() => queryPost()}>get post</button>
        <button onClick={() => getImage()}>get Image</button>
        <button onClick={() => getChannelMember()}>get Channel Member</button>
        <button onClick={() => queryChatMessages()}>get Chat Messages</button>
        <button onClick={() => clickNextPage()}>Next Page Message</button>
        <button onClick={unSubLiveMessages}>Unsubscribe</button>
        <button onClick={unSubLiveChannels}>Unsubscribe Channel</button>
        <button onClick={() => createTextTest()}>Create message</button>
        <button onClick={() => getFileDetail()}>get File</button>
        <button onClick={() => getUserList()}> get users</button>
        <button onClick={() => queryGlobalFeed()}> Query Global feed</button>
        {/* <input type="file" name="file" onChange={changeHandler} /> */}
        <input type="file" name="file" title="upload image" onChange={uploadImage} />
        {/* <input type="file" name="file image" onChange={changeHandler2} /> */}
        <button onClick={getPosts}>Get Post Community</button>
        <button onClick={getPost}>Get a Post </button>
        <button onClick={nextPostCommunity}>nextPostCommunity</button>
        <button onClick={onRefresh}>onRefresh</button>
        <button onClick={getCommentData}>get comment</button>
        <button onClick={getCommentByID}>get comment By ID</button>
        <button onClick={getReplyComment}>get reply comment</button>
        <button onClick={nextCommentPage}> next comment</button>
        <button onClick={getReplyCommentData}>get Reply comment By IDs</button>
        <button onClick={addReplyComment}>Add Reply comment</button>
        <button onClick={nextPageComment}>next page comment</button>
        <button onClick={deletePostById}>Delete post</button>
        <button onClick={startSync}>Start Sync</button>
        <button onClick={stopSync}>Stop Sync</button>
        <button onClick={createSubChannel}>create sub channel</button>
        <button onClick={getSubChannelData}>get sub channel</button>
        <button onClick={addCommentReaction}>Add comment reaction</button>
        <button onClick={reactionQuery}>Query reaction</button>
        <button onClick={checkSessionState}>Check Session State</button>
        <button onClick={getVideoImageThumbnail}>thumbnail</button>
        <button onClick={startRead}>start read</button>
        <button onClick={searchCommunity}>search community</button>
        <button onClick={searchUser1}>search user1</button>
        <button onClick={searchUser2}>search user2</button>
        <button onClick={searchUser3}>search user3</button>
        <button onClick={deleteSubChannelById}>delete subChannelId</button>
        <button onClick={queryAccounts}>query Users</button>
        <button onClick={handleUserNextPage}>query Users next page</button>
        <button onClick={createChannel}>Create Channel</button>
        <button onClick={addMessageReaction}>Add message reaction</button>
        <p>Create video message</p>
        <input type="file" name="file" title="Create video message" onChange={createVideoMessage} />
      </AuthProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
