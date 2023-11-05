import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useState
} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text as TextNative,
    View
} from 'react-native';

import { Setting } from '@/assets/svgs';
import { useAppDispatch } from '@/hooks';
import { RootNavigationProp } from '@/navigation';
import { getRecentLogs, LogSelectors } from '@/reducers/log';
import {
    CustomCacheImage,
    CustomStatusBar,
    Header,
    LogBookListItem,
    NoDataAvailable,
    PlatformImage,
    Text,
    Wrapper
} from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';
import { logTypes } from '@/types/log';
import { Constants } from '@/utils/constants';

type Props = Record<string, never>;
const limit = 10;

const Me: FunctionComponent<Props> = ({}: Props) => {
    const dispatch = useAppDispatch();
    const { recent } = LogSelectors();
    const navigation = useNavigation<RootNavigationProp>();

    const [groupedData, setGroupedData] = useState<any>([]);

    const { data, nextPage } = recent;
    const { logTypeDetails = {} } = Constants;

    useEffect(() => {
        dispatch(
            getRecentLogs({
                page: 1,
                limit
            })
        );
    }, [dispatch]);

    useEffect(() => {
        const _data = [...data];
        _data.sort((a, b) => Date.parse(b.log_time) - Date.parse(a.log_time));
        const groupedDataObject: any = {};
        _data.forEach((log) => {
            const day = String(log.log_time).split('T')[0];
            groupedDataObject[day]
                ? groupedDataObject[day].push(log)
                : (groupedDataObject[day] = [log]);
        });
        const groupedDataArray: any = [];
        for (let key in groupedDataObject) {
            groupedDataArray.push({
                date: key,
                logs: groupedDataObject[key]
            });
        }
        setGroupedData(groupedDataArray);
    }, [data]);

    const renderLogDetail = (
        value: string | number,
        unit?: string,
        type?: string
    ) => {
        return (
            <View style={styles.contentView}>
                <TextNative
                    style={{
                        fontSize: Size.Small,
                        ...styles.logText
                    }}
                >
                    {value + ' '}
                    <Text
                        fontWeight="600"
                        style={styles.unit}
                        size={12}
                        color={Colors.text.black}
                    >
                        {' ' + unit}
                        {type ? ' ' + type : ''}
                    </Text>
                </TextNative>
            </View>
        );
    };

    // 45 minutes = 00:45 , 90 minutes = 01:30 , 1000 minutes = 16:40
    const formatDurationMinutes = (minutes: number): string => {
        let formattedHours = String(Math.floor(minutes / 60));
        formattedHours = formattedHours.padStart(2, '0');
        const formattedMinutes = String(minutes % 60).padStart(2, '0');
        const formattedDurationMinues = `${formattedHours}:${formattedMinutes}`;
        return formattedDurationMinues;
    };

    const logBookBody = (type: logTypes, item: any) => {
        if (type === Constants.logs.userFast) {
            return renderLogDetail(
                formatDurationMinutes(item.duration_minutes),
                ''
            );
        } else if (type === Constants.logs.userWeight) {
            return renderLogDetail(
                Number(Number(item.amount).toFixed(2)),
                item.unit
            );
        } else if (type === Constants.logs.userInsulin) {
            return renderLogDetail(
                Number(Number(item.units).toFixed(2)),
                item.injection_type
            );
        } else if (type === Constants.logs.userExercise) {
            return renderLogDetail(
                item.activity_type,
                formatDurationMinutes(item.duration_minutes)
            );
        } else if (type === Constants.logs.userGlucose) {
            return renderLogDetail(
                item.measurement_type,
                `${Number(Number(item.amount).toFixed(2))} / ${item.unit}`
            );
        } else if (type === Constants.logs.userDrink) {
            return renderLogDetail(
                Number(Number(item.amount).toFixed(2)),
                item.unit
            );
        } else if (type === Constants.logs.userMedication) {
            return renderLogDetail(item.drug_name, item.amount, item.dose);
        } else if (type === Constants.logs.userFood) {
            return (
                <PlatformImage
                    imageId={item?.image}
                    style={styles.image}
                    width={50}
                    height={50}
                />
            );
        } else if (type === Constants.logs.userLesson) {
            return (
                <View style={styles.lessonBody}>
                    <CustomCacheImage
                        resizeMode="contain"
                        style={styles.image}
                        source={{ uri: item?.lesson?.icon }}
                    />
                    <Text
                        style={styles.lessonText}
                        size={Size.XXSmall}
                        fontWeight="700"
                        color={Colors.text.black}
                    >
                        {item?.lesson?.title}
                    </Text>
                </View>
            );
        } else {
            return null;
        }
    };

    const onRefresh = useCallback(() => {
        dispatch(
            getRecentLogs({
                page: 1,
                limit
            })
        );
    }, [dispatch]);

    const onScrollEnd = useCallback(() => {
        if (Number(nextPage) > 0) {
            dispatch(
                getRecentLogs({
                    page: nextPage,
                    limit
                })
            );
        }
    }, [dispatch, nextPage]);

    return (
        <SafeAreaView style={styles.root}>
            <CustomStatusBar />
            <Header
                title="Me"
                rightIcon={Setting}
                onRightBtnPress={() => navigation.navigate('Main.Profile')}
            />

            <View style={styles.container}>
                {data?.length === 0 ? (
                    <NoDataAvailable
                        message="You don’t have any data yet."
                        actionMessage="Press “+” to add data"
                    />
                ) : (
                    <Wrapper
                        onRefresh={onRefresh}
                        onScroll={onScrollEnd}
                        loading={false}
                    >
                        <View style={styles.content}>
                            {groupedData.map((group: any, gi: number) => (
                                <View key={`group-${gi}`}>
                                    <Text
                                        style={styles.dayText}
                                        color={Colors.text.black}
                                        fontWeight="600"
                                        size={20}
                                    >
                                        {moment().isSame(group.date, 'day')
                                            ? 'Today'
                                            : moment(group.date).format(
                                                  'D MMM YYYY'
                                              )}
                                    </Text>
                                    {group.logs?.map(
                                        (item: any, li: number) => (
                                            <LogBookListItem
                                                key={`key-${li}`}
                                                icon={
                                                    logTypeDetails[item.type]
                                                        .icon
                                                }
                                                title={
                                                    logTypeDetails[item.type]
                                                        .title
                                                }
                                                time={moment(
                                                    item.log_time,
                                                    'YYYY-MM-DD HH:mm:s'
                                                ).format('HH:mm')}
                                                type={
                                                    logTypeDetails[item.type]
                                                        .screen
                                                }
                                                item={item}
                                            >
                                                <View style={styles.card}>
                                                    <View
                                                        style={styles.dataView}
                                                    >
                                                        {logBookBody(
                                                            item.type,
                                                            item
                                                        )}
                                                    </View>
                                                </View>
                                            </LogBookListItem>
                                        )
                                    )}
                                </View>
                            ))}
                        </View>
                    </Wrapper>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: {
        backgroundColor: Colors.extras.white,
        flex: 1
    },
    container: {
        backgroundColor: Colors.extras.page_bg,
        justifyContent: 'center',
        flex: 1
    },
    content: {
        paddingHorizontal: 19
    },
    lessonBody: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    lessonText: {
        marginLeft: 12,
        width: '65%'
    },
    card: {
        flexDirection: 'column',
        backgroundColor: Colors.extras.white,
        borderRadius: 16,
        marginLeft: 18
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        flex: 1,
        marginLeft: 15
    },
    arrow: {
        marginLeft: 10
    },
    contentView: {
        height: '100%',
        flexDirection: 'row',
        alignItems: 'baseline',
        width: '95%'
    },
    dataView: {
        flexDirection: 'row',
        marginTop: 15,
        alignItems: 'center'
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 8
    },
    imageText: {
        maxWidth: '60%',
        marginLeft: 16
    },
    unit: {
        marginLeft: 10
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    notificationPoint: {
        position: 'absolute',
        right: 2
    },
    dayText: {
        marginTop: 25,
        marginBottom: 20
    },
    icon: {
        width: 20,
        height: 20
    },
    logText: {
        fontWeight: '700',
        color: Colors.text.black
    }
});

export default Me;
