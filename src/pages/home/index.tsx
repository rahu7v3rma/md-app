import {
    NavigationProp,
    RouteProp,
    useIsFocused,
    useNavigation,
    useRoute
} from '@react-navigation/native';
import moment from 'moment';
import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import {
    Animated,
    AppState,
    Dimensions,
    Platform,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import ForwordIcon from '@/assets/svg/forword.svg';
import { BellIcon } from '@/assets/svgs';
import { useAppChat } from '@/contexts/appChat';
import { useAppDispatch, useCurrentDate } from '@/hooks';
import {
    RootNavigationProp,
    RootStackParamList,
    TrackFastTimerProps
} from '@/navigation';
import { ClientConfigSelectors } from '@/reducers/clientConfig';
import { ContentSelectors, loadJourney } from '@/reducers/content';
import {
    getDailyCompletedLogs,
    getDailyTasks,
    getLogPickerValues,
    LogSelectors
} from '@/reducers/log';
import {
    getNotifications,
    NotificationSelectors
} from '@/reducers/notification';
import {
    trackComplete,
    trackedTimeUpdateManual,
    TrackSelectors
} from '@/reducers/track';
import {
    getCoach,
    getProfile,
    refreshProfileSession,
    UserSelectors
} from '@/reducers/user';
import { getFCMToken } from '@/services/notification';
import {
    ChatListItem,
    Header,
    LessonCard,
    LogTab,
    Text,
    Wrapper
} from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';
import { logItem } from '@/types/log';
import { Constants } from '@/utils/constants';

type Props = {
    route: RouteProp<any>;
    navigation: NavigationProp<any>;
} & TrackFastTimerProps;

type HomeRouteProp = RouteProp<RootStackParamList, 'Main.Home'>;

const trackFastStateTypes = Constants.trackFast.state;

const Home: FunctionComponent<Props> = (props) => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<RootNavigationProp>();

    const { chatClient } = useAppChat();
    const { currentDate, currentDateFormatted } = useCurrentDate();

    const { gotLatestVersion, storeUrl } = ClientConfigSelectors();
    const { activeBlock, activeLesson, loading } = ContentSelectors();
    const [logTabsData, setLogTabsData] = useState<any>([]);
    const { userProfile, coach, group, hasCoachChat } = UserSelectors();

    const [userLessons, setUserLessons] = useState<any>({});
    const route = useRoute<HomeRouteProp>();
    const containerRef = useRef<View>(null);
    const [ready, setReady] = useState<boolean>(false);

    const animation = useMemo(() => new Animated.Value(0), []);
    const {
        trackFastState,
        trackedTimeInSeconds,
        trackTimeLimitInSeconds,
        trackStartedAt
    } = TrackSelectors();

    const [isFastTrackerActive, setIsFastTrackerActive] =
        useState<boolean>(false);
    const [statusbarColor, setStatusbarColor] = useState('white');
    const { totalUnread } = NotificationSelectors();
    const { dailyTasks, dailyCompletedTasks } = LogSelectors();

    const isFocused = useIsFocused();

    useEffect(() => {
        setUserLessons((prevState: object) => {
            let user_lessons = { ...activeBlock };
            if (prevState?.order && prevState?.order !== activeBlock?.order) {
                let lastLesson = JSON.parse(
                    JSON.stringify(
                        prevState?.user_lessons.filter((x) => !x.is_completed)
                    )
                );
                if (Array.isArray(lastLesson) && lastLesson.length > 0) {
                    lastLesson[0].is_completed = true;
                }
                user_lessons.user_lessons = activeBlock?.user_lessons
                    ? [...lastLesson, ...activeBlock?.user_lessons]
                    : lastLesson;
            }
            return user_lessons;
        });
    }, [activeBlock]);

    useEffect(() => {
        setIsFastTrackerActive(
            trackFastState === trackFastStateTypes.tracking ||
                trackFastState === trackFastStateTypes.tracked ||
                trackFastState === trackFastStateTypes.complete
        );
    }, [trackFastState]);

    useEffect(() => {
        if (trackFastState === trackFastStateTypes.tracking) {
            setStatusbarColor(Colors.extras.error_base);
        }

        if (trackFastState === trackFastStateTypes.tracked) {
            setStatusbarColor(Colors.extras.error_lighter);
        }

        if (trackFastState === trackFastStateTypes.complete) {
            setStatusbarColor(Colors.text.black_gray);
        }

        if (trackFastState === trackFastStateTypes.empty) {
            setStatusbarColor('white');
        }
    }, [trackFastState]);

    useEffect(() => {
        animation.setValue(0);
    }, [route, animation]);

    useEffect(() => {
        dispatch(getCoach());
    }, [dispatch]);

    useEffect(() => {
        if (currentDate) {
            dispatch(getDailyCompletedLogs({ date: currentDate }));
        }
    }, [currentDate, dispatch]);

    const handleRefresh = useCallback(() => {
        dispatch(getNotifications({ page: 1, limit: 10 }));
        dispatch(loadJourney({}));
    }, [dispatch]);

    useEffect(() => {
        // load journey data on mount
        handleRefresh();

        // load chat profile as well to make the initial chat loading faster
        getFCMToken()
            .then(async (token) => {
                dispatch(
                    refreshProfileSession({
                        fcmToken: token
                    })
                );
            })
            .catch((err) => {
                // getting the fcm token fails when debugging without firebase
                // credentials. the chat should still be initialized in this case
                console.debug('Error getting FCM token: ', err);

                dispatch(refreshProfileSession({}));
            });

        // load log picker values ahead of time
        dispatch(getLogPickerValues({}));
    }, [handleRefresh, dispatch]);

    useEffect(() => {
        if (!ready) {
            // if profile was already loaded and persisted we can fetch
            // it and not wait for the result. otherwise fetch it and
            // wait for the result before we set the ready flag
            const fetchProfileAction = dispatch(getProfile({}));
            if (userProfile?.diabetes_type) {
                setReady(true);
            } else {
                // load profile data and take user to onboarding screen if needed
                fetchProfileAction
                    .unwrap()
                    .then((fetchedUserProfile) => {
                        if (fetchedUserProfile?.onboarding_form_url) {
                            navigation.replace('WebViewScreen', {
                                url: fetchedUserProfile.onboarding_form_url
                            });
                        }
                    })
                    .finally(() => {
                        setReady(true);
                    });
            }
        }
    }, [ready, userProfile, dispatch, navigation]);

    useEffect(() => {
        if (ready) {
            if (
                !dailyTasks.lastUpdatedDate ||
                moment().diff(dailyTasks.lastUpdatedDate, 'days') > 0
            ) {
                dispatch(getDailyTasks({}))
                    .unwrap()
                    .then((tasks: Array<string>[]) => {
                        const filteredDailyTasks = Constants.logTabsList.filter(
                            (item: any) => tasks.find((t) => item.type === t)
                        );
                        filteredDailyTasks.sort(function (a: any, b: any) {
                            return (
                                tasks.indexOf(a.type) - tasks.indexOf(b.type)
                            );
                        });
                        setLogTabsData(filteredDailyTasks);
                    })
                    .finally(() => {
                        setReady(true);
                    });
            } else {
                const tasks = dailyTasks.list;
                const filteredDailyTasks = Constants.logTabsList.filter(
                    (item: any) => tasks.find((t) => item.type === t)
                );
                filteredDailyTasks.sort(function (a: any, b: any) {
                    return tasks.indexOf(a.type) - tasks.indexOf(b.type);
                });
                setLogTabsData(filteredDailyTasks);
            }
        }
    }, [ready, dispatch, dailyTasks]);

    const handleMoreLessonsPress = () => {
        navigation.navigate('Block', {
            data: activeBlock
        });
    };

    const handleMoreTasksPress = useCallback(() => {
        navigation.navigate('Plus');
    }, [navigation]);

    const onCompleted = useCallback(
        (completed: boolean = false) => {
            if (completed) {
                Animated.timing(animation, {
                    toValue: Dimensions.get('window').width - 30,
                    duration: 1000,
                    useNativeDriver: false
                }).start();
            }
        },
        [animation]
    );

    const handleCoachPress = useCallback(() => {
        if (chatClient?.userID) {
            if (hasCoachChat && coach) {
                chatClient
                    .queryChannels({
                        members: { $eq: [chatClient.userID, coach.chat_id] }
                    })
                    .then((channels) => {
                        if (channels.length > 0) {
                            navigation.navigate('ChatChannel', {
                                channelId: channels[0].cid
                            });
                        }
                    });
            } else if (!hasCoachChat && group?.chat_id) {
                chatClient
                    .queryChannels({
                        id: { $in: [group.chat_id] }
                    })
                    .then((channels) => {
                        if (channels.length > 0) {
                            navigation.navigate('ChatChannel', {
                                channelId: channels[0].cid
                            });
                        }
                    });
            }
        }
    }, [coach, navigation, chatClient, hasCoachChat, group]);

    const {
        startTrackFastTimerInterval,
        stopTrackFastTimerInterval,
        trackFastTimerListener,
        setTrackFastTimerListener
    } = props;
    const startTrackFastTimer = () => {
        if (
            moment(
                moment(trackStartedAt)
                    .add(trackTimeLimitInSeconds, 's')
                    .format()
            ).diff(moment(), 'seconds') > 0
        ) {
            dispatch(
                trackedTimeUpdateManual({
                    trackedTimeInSeconds: moment().diff(
                        moment(trackStartedAt),
                        'seconds'
                    )
                })
            );
            startTrackFastTimerInterval();
        } else {
            dispatch(
                trackedTimeUpdateManual({
                    trackedTimeInSeconds: trackTimeLimitInSeconds
                })
            );
            stopTrackFastTimerInterval();
            trackFastTimerListener?.remove();
        }
    };
    useEffect(() => {
        if (trackFastState === 'tracking') {
            startTrackFastTimer();
            trackFastTimerListener?.remove();
            setTrackFastTimerListener(
                AppState.addEventListener('change', (state) => {
                    state === 'active'
                        ? startTrackFastTimer()
                        : stopTrackFastTimerInterval();
                })
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (trackedTimeInSeconds === trackTimeLimitInSeconds) {
            stopTrackFastTimerInterval();
            trackFastTimerListener?.remove();
            if (trackFastState === 'tracking') {
                dispatch(trackComplete());
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trackedTimeInSeconds]);

    if (!ready) {
        return null;
    }

    return (
        <View style={styles.root}>
            {isFocused ? (
                <StatusBar
                    backgroundColor={statusbarColor}
                    barStyle="dark-content"
                />
            ) : null}
            {Platform.OS === 'ios' && (
                <View
                    style={[
                        styles.iosStatusBar,
                        { backgroundColor: statusbarColor }
                    ]}
                />
            )}
            <View>
                <Header
                    title="Home"
                    rightIcon={BellIcon}
                    onRightBtnPress={() => navigation.navigate('Notifications')}
                    isPressable={true}
                    isFastTrackerActive={isFastTrackerActive}
                    rightIconBadgeCount={totalUnread}
                    isNewVersionAvailable={gotLatestVersion === false}
                    newVersionUpdateUrl={storeUrl}
                />
            </View>
            <Wrapper loading={loading} onRefresh={handleRefresh}>
                <View style={styles.content}>
                    {chatClient && coach && (
                        <ChatListItem
                            label={`Coach ${coach.first_name} ${coach.last_name}`}
                            avatar={coach.profile_image}
                            onPress={handleCoachPress}
                        />
                    )}
                    {activeLesson && (
                        <>
                            <View style={styles.headingContainer}>
                                <Text
                                    size={Size.Medium}
                                    fontWeight="600"
                                    color={Colors.text.mainDarker}
                                >
                                    My Next Lesson
                                </Text>
                                <TouchableOpacity
                                    onPress={handleMoreLessonsPress}
                                    testID="nextLessonMore"
                                    style={styles.moreContainer}
                                >
                                    <Text
                                        size={Size.XXXSmall}
                                        color={Colors.theme.primary}
                                    >
                                        More
                                    </Text>
                                    <SvgXml xml={ForwordIcon} />
                                </TouchableOpacity>
                            </View>

                            <View
                                style={styles.animatedWrapper}
                                ref={containerRef}
                            >
                                <Animated.View
                                    style={[
                                        styles.animatedContainer,
                                        {
                                            transform: [
                                                { translateX: animation }
                                            ]
                                        }
                                    ]}
                                >
                                    {userLessons?.user_lessons &&
                                        userLessons?.user_lessons.map(
                                            (userLesson, index) => {
                                                return (
                                                    (!userLesson.is_completed ||
                                                        userLesson.lesson.id ===
                                                            route.params
                                                                ?.lessonId) && (
                                                        <LessonCard
                                                            key={`lesson-card-${index}`}
                                                            imageUrl={
                                                                userLesson
                                                                    .lesson.icon
                                                            }
                                                            label={
                                                                userLesson
                                                                    .lesson
                                                                    .title
                                                            }
                                                            sublabel={`Part ${userLesson.order}`}
                                                            complete={
                                                                userLesson.is_completed
                                                            }
                                                            progress={
                                                                activeLesson
                                                                    ?.lesson
                                                                    .id ===
                                                                userLesson
                                                                    .lesson.id
                                                            }
                                                            id={
                                                                userLesson
                                                                    .lesson.id
                                                            }
                                                            activeLessonId={
                                                                activeLesson
                                                                    ?.lesson
                                                                    ?.id || 1
                                                            }
                                                            onPress={() => {
                                                                navigation.navigate(
                                                                    'LessonContent',
                                                                    {
                                                                        lessonId:
                                                                            userLesson
                                                                                .lesson
                                                                                .id,
                                                                        lessonName:
                                                                            userLesson
                                                                                .lesson
                                                                                .title,
                                                                        type: 'Home'
                                                                    }
                                                                );
                                                            }}
                                                            onCompleted={
                                                                onCompleted
                                                            }
                                                            containerRef={
                                                                containerRef
                                                            }
                                                            style={
                                                                styles.lessonCardStyle
                                                            }
                                                        />
                                                    )
                                                );
                                            }
                                        )}
                                </Animated.View>
                            </View>
                        </>
                    )}
                    <View style={styles.headingContainer}>
                        <Text
                            size={Size.Medium}
                            fontWeight="600"
                            color={Colors.text.mainDarker}
                        >
                            My Tasks for Today
                        </Text>
                        <TouchableOpacity
                            testID="taskTodayMore"
                            style={styles.moreContainer}
                            onPress={handleMoreTasksPress}
                        >
                            <Text
                                size={Size.XXXSmall}
                                color={Colors.theme.primary}
                            >
                                More
                            </Text>
                            <SvgXml xml={ForwordIcon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.todayTasks}>
                        {logTabsData
                            .slice(0, 4)
                            .map((item: logItem, index: number) => (
                                <LogTab
                                    key={`log-${index}`}
                                    style={styles.tab}
                                    icon={item.icon}
                                    title={item.title}
                                    onTabPress={() =>
                                        item.screen &&
                                        navigation.navigate(item?.screen)
                                    }
                                    active={
                                        dailyCompletedTasks[item.type]?.date ===
                                        currentDateFormatted
                                    }
                                />
                            ))}
                    </View>
                </View>
            </Wrapper>
        </View>
    );
};

const styles = StyleSheet.create({
    moreContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    root: {
        backgroundColor: Colors.extras.page_bg
    },
    content: {
        marginHorizontal: 19,
        marginBottom: 100,
        marginTop: 19
    },
    tab: { marginBottom: 10, width: '48%' },
    headingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 27,
        marginBottom: 19
    },
    logTabRow: {
        justifyContent: 'space-evenly',
        marginBottom: 17
    },
    animatedWrapper: {
        overflow: 'hidden',
        minHeight: 110
    },
    animatedContainer: { flexDirection: 'row-reverse' },
    todayTasks: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    logTabWrapper: {
        marginTop: 8
    },
    iosStatusBar: {
        height: 47
    },
    lessonCardStyle: {
        marginLeft: 10
    }
});

export default Home;
