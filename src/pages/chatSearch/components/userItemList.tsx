import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useState
} from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { MessageResponse } from 'stream-chat';
import {
    ChannelAvatar,
    ChannelList,
    ChannelPreviewMessengerProps,
    ChannelPreviewUnreadCount,
    Chat,
    DefaultStreamChatGenerics,
    OverlayProvider
} from 'stream-chat-react-native';
import { useDebounce } from 'use-debounce';

import { useAppChat } from '@/contexts/appChat';
import { useChannelPreviewInfo } from '@/hooks';
import { RootNavigationProp } from '@/navigation';
import { addSearchFilterData, UserSelectors } from '@/reducers/user';
import { getChannelDisplayTitle } from '@/services/chat';
import { Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';
import { ChannelsMap } from '@/types/chat';
import { SearchUserList } from '@/types/user';
import { Constants, DateTimeFormat } from '@/utils/constants';

type Props = Record<string, never>;

function hasCurrenYear(currentYear: Number, incomingYear: Number) {
    return currentYear === incomingYear;
}
function hasCurrentWeek(currentWeek: Number, incomingWeek: Number) {
    return currentWeek === incomingWeek;
}
function hasToday(currentDay: Number, incomingDay: Number) {
    return currentDay === incomingDay;
}
function checkArray(arr: any) {
    return Array.isArray(arr);
}
function generateTimeSeriesCard(searchDatas: SearchUserList[]) {
    searchDatas?.sort(function (a, b) {
        return b?.time?.localeCompare(a?.time);
    });
    const refineDatas = [] as any;
    const cards = {} as any;
    const currentDate = moment();
    const currentYear = Number(currentDate.format('Y'));
    const currentDay = Number(currentDate.format('D'));
    const currentWeek = Number(currentDate.week());

    searchDatas?.forEach((item: any) => {
        const year = Number(moment(item?.time, DateTimeFormat).format('Y'));
        const day = Number(moment(item?.time, DateTimeFormat).format('D'));
        const week = Number(moment(item?.time, DateTimeFormat).week());

        refineDatas.push({
            ...item,
            isToday:
                hasCurrenYear(year, currentYear) &&
                hasCurrentWeek(week, currentWeek) &&
                hasToday(day, currentDay),
            isCurrentWeek:
                hasCurrenYear(year, currentYear) &&
                hasCurrentWeek(week, currentWeek),
            isCurrentMonth: hasCurrenYear(year, currentYear)
        });
    });
    refineDatas.forEach((item: any) => {
        const month = Number(moment(item?.time, DateTimeFormat).format('M'));
        const year = Number(moment(item?.time, DateTimeFormat).format('Y'));
        const day = Number(moment(item?.time, DateTimeFormat).format('D'));

        const key = month + '/' + year;

        if (
            item.isToday ||
            (item.isCurrentWeek &&
                item.isCurrentMonth &&
                day === currentDay - 1)
        ) {
            if (cards?.hasOwnProperty('Recent New')) {
                cards['Recent New'].data?.push({ ...item });
            } else {
                const data = { data: [{ ...item }] };
                cards['Recent New'] = data;
            }
        } else if (item.isCurrentWeek) {
            if (cards.hasOwnProperty('Last Week')) {
                cards['Last Week'].data.push({ ...item });
            } else {
                const data = { data: [{ ...item }] };
                cards['Last Week'] = data;
            }
        } else {
            if (cards.hasOwnProperty(key)) {
                if (cards[key].hasOwnProperty('data')) {
                    cards[key].data.push({ ...item });
                } else {
                    cards[key].data = [{ ...item }];
                }
            } else {
                const data = { data: [{ ...item }] };
                cards[key] = data;
            }
        }
    });
    return cards;
}

const _renderChannelPreview = ({
    channel,
    latestMessagePreview,
    maxUnreadCount
}: ChannelPreviewMessengerProps) => {
    const dispatch = useDispatch();
    const navigation = useNavigation<RootNavigationProp>();
    const { displayTitle } = useChannelPreviewInfo({
        channel
    });

    const latestMessageCreatedAt =
        latestMessagePreview.messageObject?.created_at;
    const latestMessageDate = latestMessageCreatedAt
        ? moment(latestMessageCreatedAt).format('MM/DD/YYYY')
        : '';

    return (
        <TouchableOpacity
            onPress={() => {
                dispatch(
                    addSearchFilterData({
                        id: channel.cid,
                        name: displayTitle || '',
                        message: '',
                        time: moment(new Date())
                            .format('DD/MM/YYYY HH:mm')
                            .toString()
                    })
                );
                navigation.navigate('ChatChannel', {
                    channelId: channel.cid
                });
            }}
            style={styles.channelPreview}
        >
            <ChannelAvatar channel={channel} />
            <View style={styles.channelPreviewInfo}>
                <View style={styles.channelPreviewTitle}>
                    <Text
                        size={Size.XSmall}
                        fontWeight="600"
                        color={Colors.text.black}
                        testID="displayTitle"
                    >
                        {displayTitle}
                    </Text>
                    <ChannelPreviewUnreadCount
                        channel={channel}
                        maxUnreadCount={maxUnreadCount || 0}
                    />
                </View>
                <View style={styles.channelPreviewMessage}>
                    <View style={styles.latestMessagePreviewView}>
                        {latestMessagePreview.previews.map((preview, index) => (
                            <Text key={index}>{preview.text}</Text>
                        ))}
                    </View>
                    <Text
                        size={Size.XXXSmall}
                        fontWeight="400"
                        color={Colors.text.gray}
                        testID="messageDate"
                    >
                        {latestMessageDate}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const UserItemList: FunctionComponent<Props> = ({}: Props) => {
    const navigation = useNavigation<RootNavigationProp>();
    const { searchUserDataResult, searchText } = UserSelectors();
    const [searchTextValue] = useDebounce(searchText || '', 1500);
    const { userDataList = {} } = Constants;
    const { chatClient } = useAppChat();
    const [serachResult, setSearchResult] = useState<
        {
            message: MessageResponse<DefaultStreamChatGenerics>;
        }[]
    >([]);
    const [channelsMap, setChannelsMap] = useState<ChannelsMap | []>([]);
    const isMonth = (date: string) => {
        if (
            moment(date, 'M/yyyy').format('MMMM') === 'Invalid date' ||
            moment(date, 'M/yyyy').format('MMMM') === 'NaN'
        ) {
            return date;
        } else {
            return moment(date, 'M/yyyy').format('MMMM');
        }
    };

    const isDay = (date: string) => {
        if (moment(date, DateTimeFormat).isSame(moment(), 'day')) {
            return 'Today';
        } else if (
            moment(date, DateTimeFormat).isSame(
                moment().subtract(1, 'day'),
                'day'
            )
        ) {
            return 'Yesterday';
        } else {
            return moment(date, DateTimeFormat).format('DD/MM/YY');
        }
    };

    const getSearchFilterData = React.useMemo(() => {
        if (searchTextValue !== '') {
            return userDataList?.filter(function (item: any) {
                const itemData = item?.name
                    ? item?.name.toLowerCase()
                    : ''.toLowerCase();
                const textData = searchTextValue?.toString().toLowerCase();
                return itemData?.indexOf(textData) > -1;
            });
        } else {
            if (searchUserDataResult) {
                const copysearchUserDataResult = [...searchUserDataResult];
                return generateTimeSeriesCard(copysearchUserDataResult);
            } else {
                return [];
            }
        }
    }, [searchUserDataResult, searchTextValue, userDataList]);

    const searchMessage = useCallback(async () => {
        if (!searchTextValue) {
            setSearchResult([]);
            return;
        }
        const filters = {
            members: { $in: [chatClient?.userID + ''] }
        };
        const msgFilter = {
            text: { $autocomplete: searchTextValue + '' }
        };
        const search = await chatClient?.search(filters, msgFilter, {
            limit: 20,
            offset: 0
        });
        if (Array.isArray(search?.results)) {
            const result = search?.results.filter((item) =>
                item.message.text
                    ?.toLowerCase()
                    .includes(searchTextValue.toLowerCase())
            );
            setSearchResult(result || []);
        } else {
            setSearchResult([]);
        }
    }, [chatClient, searchTextValue]);

    useEffect(() => {
        searchMessage();
    }, [searchTextValue, searchMessage]);

    useEffect(() => {
        chatClient &&
            chatClient
                .queryChannels({
                    members: { $in: [chatClient.userID || ''] }
                })
                .then((channels) => {
                    let channels_map = channels.map((channel) => [
                        channel.id,
                        getChannelDisplayTitle(channel, {
                            id: chatClient.userID || ''
                        })
                    ]);
                    setChannelsMap(channels_map);
                });
    }, [chatClient]);

    const channelsList = React.useMemo(
        () =>
            channelsMap
                .filter((channel_map) =>
                    (channel_map[1] || '')
                        .toLowerCase()
                        .includes((searchText || '').toLowerCase())
                )
                .map((channel_map) => channel_map[0] || ''),
        [channelsMap, searchText]
    );

    const onMessagePress = useCallback(
        (message: MessageResponse<DefaultStreamChatGenerics>) => {
            navigation.navigate('ChatChannel', {
                channelId: message?.channel?.cid + '',
                messageId: message?.id
            });
        },
        [navigation]
    );

    const messageSeperator = () => {
        return <View style={styles.divider} />;
    };

    const messageHeaderComponent = () => {
        return (
            <Text size={Size.XSmall} fontWeight="600" style={styles.textTitle1}>
                Messages
            </Text>
        );
    };

    const channelSerachResult = () => {
        return (
            <>
                <Text
                    size={Size.XSmall}
                    fontWeight="600"
                    style={styles.textTitle}
                >
                    Channels
                </Text>
                {chatClient?.userID && (
                    <Chat client={chatClient}>
                        {channelsList.length ? (
                            <ChannelList
                                additionalFlatListProps={{
                                    contentContainerStyle: {
                                        backgroundColor: 'transparent'
                                    },
                                    style: {
                                        backgroundColor: 'transparent'
                                    }
                                }}
                                filters={{
                                    id: {
                                        $in: channelsList
                                    },
                                    members: { $in: [chatClient.userID] }
                                }}
                                Preview={_renderChannelPreview}
                                sort={{ last_message_at: -1 }}
                                options={{ limit: 20, message_limit: 30 }}
                            />
                        ) : null}
                    </Chat>
                )}
            </>
        );
    };
    return (
        <GestureHandlerRootView style={styles.root}>
            {!checkArray(getSearchFilterData) &&
            Object.keys(getSearchFilterData).length > 0 ? (
                <ScrollView style={styles.scrollList}>
                    {Object.entries(getSearchFilterData)?.map(
                        ([key, Users]: [any, any]) => {
                            return (
                                <View key={key} style={styles.container}>
                                    <Text
                                        style={styles.title}
                                        fontWeight="600"
                                        size={12}
                                        color={Colors.text.gray}
                                    >
                                        {isMonth(key)}
                                    </Text>
                                    {Users?.data
                                        ?.reverse()
                                        .map((User: any, index: any) => {
                                            return (
                                                <TouchableOpacity
                                                    style={styles.item}
                                                    key={index}
                                                    onPress={() => {
                                                        navigation.navigate(
                                                            'ChatChannel',
                                                            {
                                                                channelId:
                                                                    User.id
                                                            }
                                                        );
                                                    }}
                                                >
                                                    <View
                                                        style={
                                                            styles.nameAndTimeWrapper
                                                        }
                                                    >
                                                        <Text
                                                            fontWeight="600"
                                                            size={16}
                                                            color={
                                                                Colors.text
                                                                    .black
                                                            }
                                                        >
                                                            {User?.name}
                                                        </Text>
                                                        <Text
                                                            fontWeight="400"
                                                            size={12}
                                                            color={
                                                                Colors.text.gray
                                                            }
                                                        >
                                                            {isDay(User?.time)}
                                                        </Text>
                                                    </View>
                                                    <Text
                                                        fontWeight="400"
                                                        size={12}
                                                        color={Colors.text.gray}
                                                    >
                                                        {User?.message}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                </View>
                            );
                        }
                    )}
                </ScrollView>
            ) : (
                <OverlayProvider>
                    <FlatList
                        data={serachResult}
                        style={styles.messageList}
                        ItemSeparatorComponent={messageSeperator}
                        keyExtractor={(item) => item.message.id}
                        renderItem={({ item: { message } }) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        onMessagePress(message);
                                    }}
                                    style={styles.messageView}
                                >
                                    <View style={styles.fullFlex}>
                                        <Text
                                            color={Colors.text.charcoal}
                                            size={Size.XSmall}
                                            fontWeight={'600'}
                                        >
                                            {message.channel?.name ||
                                                message.user?.name}
                                        </Text>
                                        <Text
                                            color={Colors.text.gray_Base}
                                            size={Size.XXXSmall}
                                            numberOfLines={1}
                                        >
                                            {message.text}
                                        </Text>
                                    </View>
                                    <Text
                                        color={Colors.text.gray_Base}
                                        size={Size.XXXSmall}
                                    >
                                        {moment(message.created_at).format(
                                            'DD/MM/YYYY'
                                        )}
                                    </Text>
                                </TouchableOpacity>
                            );
                        }}
                        ListHeaderComponent={messageHeaderComponent}
                        ListFooterComponent={channelSerachResult}
                    />
                </OverlayProvider>
            )}
        </GestureHandlerRootView>
    );
};

export default UserItemList;

const styles = StyleSheet.create({
    fullFlex: {
        flex: 1,
        paddingEnd: 10
    },
    messageList: {
        flexGrow: 0,
        paddingVertical: 10
    },
    divider: {
        height: 1,
        backgroundColor: Colors.modals.divider,
        marginVertical: 10
    },
    messageView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        alignItems: 'center'
    },
    textTitle1: {
        color: Colors.extras.black,
        marginTop: 0,
        marginHorizontal: 10,
        marginBottom: 10
    },
    textTitle: {
        color: Colors.extras.black,
        marginTop: 25,
        marginHorizontal: 10,
        marginBottom: 10
    },
    root: {
        flex: 1,
        zIndex: 1,
        backgroundColor: Colors.theme.app_background_lightest
    },
    scrollList: {
        flex: 1
    },
    container: {
        backgroundColor: Colors.theme.app_background_lightest
    },
    item: {
        marginVertical: 5,
        marginHorizontal: 20
    },
    nameAndTimeWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    title: {
        paddingVertical: 10,
        marginHorizontal: 20
    },
    channelPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16
    },
    channelPreviewInfo: {
        flex: 1,
        paddingLeft: 10,
        flexDirection: 'column'
    },
    channelPreviewTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    channelPreviewMessage: {
        marginTop: 4,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    latestMessagePreviewView: {
        flexDirection: 'row'
    }
});
