import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { FunctionComponent, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { BackIcon } from '@/assets/svgs';
import { useAppDispatch } from '@/hooks';
import { RootNavigationProp, RootStackParamList } from '@/navigation';
import { ContentSelectors, getNavigationKey } from '@/reducers/content';
import { CustomStatusBar, Header, LessonCard, Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';
import { UserLesson } from '@/types/content';

type Props = Record<string, never>;
type ContentRouteProp = RouteProp<RootStackParamList, 'Block'>;

const Block: FunctionComponent<Props> = ({}: Props) => {
    const navigation = useNavigation<RootNavigationProp>();
    const route = useRoute<ContentRouteProp>();
    const [lessons, setLessons] = React.useState<Array<UserLesson>>([]);
    const { activeBlock, activeLesson } = ContentSelectors();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(
            getNavigationKey.navigation(route.params?.navigationId || route.key)
        );
        if (route.params?.navigationId) {
            // return to the journey page
            navigation.pop();
            navigation.pop();
        }
        if (route.params?.data) {
            let lessonsList = route.params?.data?.user_lessons ?? [];
            setLessons(lessonsList);
        } else {
            setLessons(activeBlock?.user_lessons || []);
        }
    }, [
        route.params?.data,
        activeBlock,
        navigation,
        route.params?.navigationId,
        dispatch,
        route.key
    ]);

    return (
        <SafeAreaView style={styles.root}>
            <CustomStatusBar />
            <Header
                leftIcon={BackIcon}
                onLeftBtnPress={() => {
                    navigation.goBack();
                }}
                styles={styles.header}
                leftIconBgColor={Colors.extras.white}
                isLeftIconShadow={true}
                seperator={false}
            />
            <View style={styles.subHeadingContainer}>
                <Text size={Size.XSmall} fontWeight="bold">
                    Level {route.params?.data?.order}
                </Text>
                <Text size={Size.XLarge} fontWeight="bold">
                    {route.params?.data?.block?.name}
                </Text>
            </View>
            <ScrollView style={styles.cardsContainer}>
                {lessons.map((userLesson, index) => (
                    <LessonCard
                        key={`lesson-card-${index}`}
                        imageUrl={userLesson.lesson.icon}
                        label={userLesson.lesson.title}
                        sublabel={`Part ${userLesson.order}`}
                        complete={userLesson.is_completed}
                        onPress={() =>
                            (userLesson.is_completed ||
                                activeLesson?.lesson.id ===
                                    userLesson.lesson.id) &&
                            navigation.navigate('LessonContent', {
                                lessonId: userLesson.lesson.id,
                                lessonName: userLesson.lesson.title,
                                type: 'Block',
                                navigationKey:
                                    route.params?.navigationId || route.key
                            })
                        }
                        progress={
                            activeLesson?.lesson.id === userLesson.lesson.id
                        }
                        shouldAnimate={false}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#f5f8fb',
        flex: 1
    },
    header: {
        backgroundColor: Colors.extras.transparent
    },
    subHeadingContainer: {
        paddingHorizontal: 30,
        marginTop: 30
    },
    cardsContainer: {
        marginTop: 20,
        paddingHorizontal: 10,
        flex: 1
    }
});

export default Block;
