import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent, useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';

import { BackIcon } from '@/assets/svgs';
import { useAppDispatch } from '@/hooks';
import { RootNavigationProp } from '@/navigation';
import {
    getNotifications,
    NotificationSelectors
} from '@/reducers/notification';
import { CustomStatusBar, Header } from '@/shared';
import { Colors } from '@/theme/colors';
import { Notification } from '@/types/notification';

import { NotificationItem } from './components';

type Props = Record<string, never>;

const Notifications: FunctionComponent<Props> = ({}: Props) => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<RootNavigationProp>();

    const { notification } = NotificationSelectors();

    const [isBottomLoader, setBottomLoader] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const onLoadMoreNotification = useCallback(() => {
        const { has_next, next_page_number } = notification;
        if (has_next) {
            setBottomLoader(true);
            dispatch(getNotifications({ page: next_page_number, limit: 10 }))
                .unwrap()
                .then(() => {})
                .catch((errorRes) => {
                    Toast.show({
                        type: 'errorResponse',
                        text1: errorRes?.data?.message || 'Network Error!',
                        position: 'bottom'
                    });
                })
                .finally(() => {
                    setBottomLoader(false);
                });
        }
    }, [notification, dispatch]);

    const notificationBottomLoader = () => {
        return (
            <>
                {isBottomLoader && (
                    <View style={styles.bottomLoader}>
                        <ActivityIndicator
                            color={Colors.theme.primary}
                            size={'large'}
                        />
                    </View>
                )}
            </>
        );
    };

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        dispatch(getNotifications({ page: 1, limit: 10 }))
            .unwrap()
            .then(() => {
                setIsRefreshing(false);
            })
            .catch((errorRes: any) => {
                Toast.show({
                    type: 'errorResponse',
                    text1: errorRes?.data?.message || 'Network Error!',
                    position: 'bottom'
                });
            })
            .finally(() => {
                setBottomLoader(false);
            });
    }, [dispatch]);

    return (
        <SafeAreaView style={styles.root}>
            <CustomStatusBar />
            <Header
                leftIcon={BackIcon}
                onLeftBtnPress={() => navigation.pop()}
                title="Notifications"
            />

            <View style={styles.content}>
                {notification && (
                    <FlatList
                        data={notification.list}
                        renderItem={({ item }) => (
                            <NotificationItem
                                id={item.id}
                                title={item.title}
                                description={item.description}
                                dateTime={item.date_time}
                                type={item.type}
                                payload={item.payload}
                                read={item.read_flag}
                            />
                        )}
                        keyExtractor={(item: Notification, index: number) =>
                            item.id + index.toString()
                        }
                        onEndReachedThreshold={0.001}
                        onEndReached={onLoadMoreNotification}
                        ListFooterComponent={notificationBottomLoader}
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

export default Notifications;

const styles = StyleSheet.create({
    bottomLoader: {
        width: '100%',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center'
    },
    root: {
        flex: 1,
        backgroundColor: Colors.extras.white
    },
    shadowView: {
        width: '100%',
        borderColor: Colors.button.app_button_border,
        backgroundColor: Colors.extras.page_bg,
        shadowColor: Colors.extras.page_bg,
        shadowOffset: { width: 2, height: 6 },
        elevation: 8
    },
    content: {
        flex: 1,
        backgroundColor: Colors.extras.page_bg
    },
    chatItem: {
        backgroundColor: 'transparent'
    },
    readItem: {
        backgroundColor: Colors.extras.white
    }
});
