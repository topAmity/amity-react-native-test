import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {
  createQuery,
  runQuery,
  getChannel,
  createImage,
  updatePost,
  getPost
} from "@amityco/ts-sdk";
import AuthProvider from "./auth";

export default function App() {
  function queryChannel() {
    console.log("test");
    const query = createQuery(getChannel, "63872c8f24fbe0b358515779");

    runQuery(query, (result) => console.log("ts", result));
  }
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    const data = new FormData();
    data.append("files", event.target.files[0]);

    const query = createQuery(createImage, data);

    runQuery(query, (result) => console.log("===result=====", result));
  };

 
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
  return (
    <View style={styles.container}>
     <AuthProvider>
        <button onClick={() => queryChannel()}>test channel</button>
        <button onClick={() => editPost()}>test post</button>
        <button onClick={() => queryPost()}>get post</button>
        <input type="file" name="file" onChange={changeHandler} />;
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
