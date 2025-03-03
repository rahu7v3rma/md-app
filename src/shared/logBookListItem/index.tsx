import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { ArrowNext } from '@/assets/svgs';
import { RootNavigationProp, RootStackParamList } from '@/navigation';
import { Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';
import {
    EditLogActivity,
    EditLogBlood,
    EditLogDrink,
    EditLogFast,
    EditLogFood,
    EditLogInsulin,
    EditLogMedication,
    EditLogWeight
} from '@/types/log';
import { Constants } from '@/utils/constants';

type Props = {
    children: React.ReactNode;
    icon: any;
    title: string;
    time?: string;
    testID?: string;
    type: RootStackParamList;
    item?:
        | EditLogMedication
        | EditLogInsulin
        | EditLogDrink
        | EditLogActivity
        | EditLogFast
        | EditLogFood
        | EditLogWeight
        | EditLogBlood;
    containerTouchID?: string;
    timeTestID?: string;
    titleTestID?: string;
};

const LogBookListItem: FunctionComponent<Props> = ({
    children,
    icon,
    title,
    time,
    type,
    item,
    containerTouchID,
    titleTestID,
    timeTestID
}: Props) => {
    const navigation = useNavigation<RootNavigationProp>();

    return (
        <TouchableOpacity
            activeOpacity={item?.type !== Constants.logs.userLesson ? 0.3 : 1}
            style={styles.wrapper}
            testID={containerTouchID}
            onPress={() => {
                if (item?.type !== Constants.logs.userLesson) {
                    navigation.navigate(type, item);
                }
            }}
        >
            <View style={styles.header}>
                <View style={styles.firstCol}>
                    <SvgXml xml={icon} />
                </View>
                <View style={styles.secondCol}>
                    <Text
                        color={Colors.theme.primary}
                        fontWeight="600"
                        testID={titleTestID}
                        size={Size.XXSmall}
                        style={styles.title}
                    >
                        {title}
                    </Text>
                </View>
                <View style={styles.thirdCol}>
                    <Text
                        color={Colors.text.gray_Base}
                        size={Size.XXSmall}
                        testID={timeTestID}
                        fontWeight="500"
                    >
                        {time}
                    </Text>
                    {item?.type !== Constants.logs.userLesson && <ArrowNext />}
                </View>
            </View>
            <View style={styles.content}>{children}</View>
        </TouchableOpacity>
    );
};

export default LogBookListItem;

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: Colors.extras.white,
        borderRadius: 20,
        paddingBottom: 10,
        marginBottom: 14
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 18
    },
    firstCol: {
        width: '10%',
        marginLeft: 20
    },
    title: {
        lineHeight: 20
    },
    secondCol: {
        width: '65%',
        alignSelf: 'center'
    },
    thirdCol: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '25%'
    },
    arrowNext: {
        marginLeft: '12%'
    },
    content: {
        marginTop: 6,
        marginLeft: 6
    }
});
