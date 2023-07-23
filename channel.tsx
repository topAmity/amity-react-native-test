import React, {ReactElement, ReactNode, useCallback, useRef} from 'react';

import {
  View,
  Text,
  Button,
  FlatList,
  ScrollView,
  NativeScrollEvent,
  ActivityIndicator,
  useWindowDimensions,
  Dimensions,
} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

import {createQuery, runQuery, queryChannels} from '@amityco/ts-sdk';
import ChatList, {IChatListProps} from '../../components/ChatList';
import useAuth from '../../hooks/useAuth';
import {useEffect, useState} from 'react';
import moment from 'moment';

import LoadingIndicator from '../../components/LoadingIndicator';
import  styles  from './styles';
import CustomText from '../../components/CustomText';
export default function RecentChat() {
  const {client} = useAuth();
  const [channelObjects, setChannelObjects] = useState<IChatListProps[]>([]);
  console.log('channelObjects: ', channelObjects);
  const scrollViewRef = useRef<ScrollView>(null);
  const [isScrollEnd, setIsScrollEnd] = useState(false);
  const [channelOptions, setChannelOptions] = useState<Amity.RunQueryOptions<typeof queryChannels>>();
  const {loading, nextPage, error} = channelOptions ?? {};
  const initialLayout = {width: Dimensions.get('window').width, };
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([{key: 'first', title: 'Recent'}]);

  const handleScroll = ({nativeEvent}: {nativeEvent: NativeScrollEvent}) => {
    const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
    const isEnd =
      layoutMeasurement.height + contentOffset.y >= contentSize.height;

    setIsScrollEnd(isEnd);
  };
  useEffect(() => {
    onQueryChannel({limit: 10}, true);
  }, [client.userId]);

  const onQueryChannel = useCallback((page = {limit: 10}, reset = false) => {
    const query = createQuery(queryChannels, {
      membership: 'member',
      page: page,
    });

    runQuery(query, ({data: channels, ...options}) => {
      setChannelOptions(options);
      if (channels) {
        const formattedChannelObjects: IChatListProps[] =
          channels &&
          channels.map((item: Amity.Channel<any>) => {
            const lastActivityDate: string = moment(item.lastActivity).format(
              'DD/MM/YYYY',
            );
            const todayDate = moment(Date.now()).format('DD/MM/YYYY');
            let dateDisplay;
            if (lastActivityDate == todayDate) {
              dateDisplay = moment(item.lastActivity).format('hh:mm A');
            } else {
              dateDisplay = moment(item.lastActivity).format('DD/MM/YYYY');
            }

            return {
              chatId: item.defaultSubChannelId ?? '',
              chatName: item.displayName ?? '',
              chatMemberNumber: item.memberCount ?? 0,
              unReadMessage: item.messageCount ?? 0, // change to defaultSubChannelUnreadCount later after product team fix this !!!!!!!!!
              messageDate: dateDisplay ?? '',
              channelType: item.type??'',
            };
          });
        setChannelObjects(prevChannels =>
          reset
            ? formattedChannelObjects
            : [...prevChannels, ...formattedChannelObjects],
        );
      }
    });
  }, []);
  useEffect(() => {
    if (isScrollEnd) {
      handleLoadMore();
    }
  }, [isScrollEnd]);

  const handleLoadMore = () => {
    if (nextPage) {
      onQueryChannel(nextPage);
    }
  };

 
  const renderRecentChat = (): ReactElement => {
    return (
      <View>
        <ScrollView
          scrollEventThrottle={16}
          ref={scrollViewRef}
          onScroll={handleScroll}>
          {channelObjects?.map((item: IChatListProps) => {
            return (
              <ChatList
                key={item.chatId}
                chatId={item.chatId}
                chatName={item.chatName}
                chatMemberNumber={item.chatMemberNumber}
                unReadMessage={item.unReadMessage}
                messageDate={item.messageDate}
                channelType={item.channelType}
              />
            );
          })}
          {loading && <LoadingIndicator />}
        </ScrollView>
      </View>
    );
  };
  const renderScene = SceneMap({
    first: renderRecentChat,

  });
  return (
 
      <TabView
      style={{ backgroundColor: '#FFFFF' }}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={props =>
          <TabBar
          {...props}
          indicatorStyle={styles.indicatorStyle}
          style={{ backgroundColor: 'white', }}
          tabStyle={styles.tabStyle} // here
          renderLabel={({ route, focused, color }) => (
              <CustomText style={styles.fontStyle}>
                  {route.title}
              </CustomText>
          )}
        />} />
    
   
  );
}
