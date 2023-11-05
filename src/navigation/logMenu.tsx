import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import track from '@/assets/svg/track.svg';
import { CrossIcon } from '@/assets/svgs';
import { RootNavigationProp } from '@/navigation';
import { LogSelectors } from '@/reducers/log';
import { LogTab } from '@/shared';
import { Colors } from '@/theme/colors';
import { Constants } from '@/utils/constants';

type LogMenuProps = {
    isDisplayJourneyLogs?: boolean;
};

interface LogTabProps {
    id: any;
    title: string;
    screen: string;
    type: string[];
}

const LogMenuComponent: FunctionComponent<LogMenuProps> = ({
    isDisplayJourneyLogs
}) => {
    const navigation = useNavigation<RootNavigationProp>();
    const { dailyTasks } = LogSelectors();

    const orderedLogList = useMemo(() => {
        if (isDisplayJourneyLogs) {
            const filterLogTabs = Constants?.logTabsList.filter(
                (i: LogTabProps) => dailyTasks?.list?.includes(i.type)
            );
            return filterLogTabs.sort(
                (a: any, b: any) =>
                    dailyTasks?.list?.indexOf(a.type) -
                    dailyTasks?.list?.indexOf(b.type)
            );
        }
        return Constants?.logTabsList;
    }, [dailyTasks?.list, isDisplayJourneyLogs]);

    return (
        <SafeAreaView style={styles.logMenuWrapper}>
            <View style={styles.logMenuTop}>
                <LogTab
                    icon={track}
                    title="Fasting Timer"
                    onTabPress={() => {
                        navigation.replace('TrackFast');
                    }}
                    style={styles.logMenuTopTab}
                    textStyle={styles.logMenuTitle}
                />
            </View>

            <View style={styles.logMenuContent}>
                <FlatList
                    data={orderedLogList}
                    renderItem={({ item }: any) => (
                        <LogTab
                            icon={item.icon}
                            title={item.title}
                            style={styles.tab}
                            onTabPress={() => {
                                navigation.replace(item.screen);
                            }}
                        />
                    )}
                    keyExtractor={(item: any) => item.id}
                    numColumns={2}
                    horizontal={false}
                    columnWrapperStyle={styles.logMenuRow}
                />
                <TouchableOpacity
                    style={styles.closeBtn}
                    testID="closeButton"
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <CrossIcon />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default LogMenuComponent;

const styles = StyleSheet.create({
    logMenuWrapper: {
        flex: 1,
        backgroundColor: Colors.theme.primary,
        justifyContent: 'space-between'
    },
    logMenuTop: {
        marginTop: 16
    },
    logMenuTopTab: {
        width: '90%',
        alignSelf: 'center'
    },
    logMenuContent: {
        margin: 16,
        flexShrink: 1
    },
    logMenuTitle: { width: '100%' },
    logMenuRow: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 14
    },
    tab: { width: '48%', marginRight: 4 },
    closeBtn: {
        width: 52,
        height: 52,
        borderRadius: 52 / 2,
        backgroundColor: Colors.extras.white,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        textAlign: 'center'
    }
});
