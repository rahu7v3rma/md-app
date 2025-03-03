import {
    CommonActions,
    RouteProp,
    useNavigation,
    useRoute
} from '@react-navigation/native';
import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useState
} from 'react';
import { ActivityIndicator, Alert, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CrossIcon from '@/assets/svgs/Cross';
import { useAppDispatch } from '@/hooks';
import { RootNavigationProp, RootStackParamList } from '@/navigation';
import {
    completeLesson,
    ContentSelectors,
    loadJourney,
    loadLesson
} from '@/reducers/content';
import {
    Button,
    CustomCacheImage,
    CustomStatusBar,
    Header,
    Text,
    VideoPlayer
} from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';
import { UserLesson } from '@/types/content';

import TextContent from './components/textContent';
import { contentStyle } from './style';

type Props = Record<string, never>;

type ContentRouteProp = RouteProp<RootStackParamList, 'LessonContent'>;

const Content: FunctionComponent<Props> = ({}: Props) => {
    const navigation = useNavigation<RootNavigationProp>();
    const dispatch = useAppDispatch();

    const route = useRoute<ContentRouteProp>();
    const { activeBlock, navigationKey } = ContentSelectors();

    const [imageContent, setImageContent] = useState<string | null>(null);
    const [videoContent, setVideoContent] = useState<string | null>(null);
    const [textContent, setTextContent] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setErr] = useState<boolean>(false);
    const [hash, setHash] = useState<string>('');

    useEffect(() => {
        setLoading(true);

        dispatch(loadLesson({ lessonId: route.params?.lessonId }))
            .unwrap()
            .then((lessonData) => {
                let lessonTextContent: string = '';

                for (const userLesson of lessonData) {
                    if (userLesson.video_content) {
                        const videoUrl: string = String(
                            userLesson?.video_content?.video
                        );
                        if (videoUrl?.includes('/')) {
                            const videoId: string =
                                videoUrl.split('.com/').length > 1
                                    ? videoUrl.split('.com/')[1]
                                    : videoUrl.split('.com/')[0];
                            const hashValue = videoId?.split('/')[1];
                            setVideoContent(videoId?.split('/')[0]);
                            setHash(hashValue);
                        } else {
                            // when we receive only video id without hash
                            setVideoContent(userLesson.video_content.video);
                        }
                    }

                    if (userLesson.img_content) {
                        setImageContent(userLesson.img_content.img_id);
                    }

                    if (userLesson.text_content) {
                        if (lessonTextContent.length > 0) {
                            lessonTextContent =
                                lessonTextContent.concat('\n\n');
                        }
                        lessonTextContent = lessonTextContent.concat(
                            userLesson.text_content.text.replace(/\\n/g, '\n')
                        );
                    }
                }

                setTextContent(lessonTextContent);

                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                Alert.alert(err.message);
            });
    }, [dispatch, route]);

    const onLessonComplete = useCallback(() => {
        setLoading(true);
        // check if the lesson is already completed
        if (
            !(
                activeBlock?.user_lessons.filter(
                    (userLesson: UserLesson) =>
                        userLesson.lesson.id === route.params?.lessonId &&
                        !userLesson.is_completed
                ) || []
            ).length
        ) {
            navigation.goBack();
            return;
        }
        dispatch(completeLesson({ lessonId: route.params?.lessonId }))
            .unwrap()
            .then(() => {
                // trigger journey data reload
                dispatch(loadJourney({}));
                setLoading(false);
                const dataBlock = JSON.parse(JSON.stringify(activeBlock));
                const lesson =
                    dataBlock?.user_lessons.filter(
                        (userLesson: UserLesson) =>
                            userLesson.lesson.id === route.params?.lessonId
                    ) || [];
                if (lesson.length) {
                    lesson[0].is_completed = true;
                }

                if (route.params.type === 'Home') {
                    if (
                        navigationKey &&
                        JSON.stringify(navigation.getState()?.routes).includes(
                            navigationKey
                        )
                    ) {
                        navigation.dispatch({
                            ...CommonActions.setParams({ data: dataBlock }),
                            source: navigationKey
                        });
                    }

                    navigation.navigate('Main.Home', {
                        lessonId: route.params?.lessonId
                    });
                }
                if (route.params.type === 'Block') {
                    navigation.dispatch({
                        ...CommonActions.setParams({ data: dataBlock }),
                        source: route.params.navigationKey
                    });

                    navigation.navigate('Main.Home', {
                        lessonId: route.params?.lessonId
                    });
                }
            })
            .catch((err) => {
                setLoading(false);
                Alert.alert(err.message);
            });
    }, [dispatch, route, navigation, activeBlock, navigationKey]);
    const handleError = () => {
        setErr(true);
    };
    return (
        <SafeAreaView style={contentStyle.root}>
            <CustomStatusBar />
            {loading ? (
                <View style={contentStyle.loader}>
                    <ActivityIndicator
                        size={'large'}
                        color={Colors.progress.activity_indicator}
                    />
                </View>
            ) : (
                <View style={contentStyle.wrapper}>
                    <Header
                        leftIcon={CrossIcon}
                        onLeftBtnPress={() => {
                            navigation.goBack();
                        }}
                        styles={contentStyle.header}
                        leftIconBgColor={Colors.extras.white}
                        isLeftIconShadow={true}
                    />
                    {videoContent && !error ? (
                        <VideoPlayer
                            style={contentStyle.videoPlayer}
                            videoId={videoContent}
                            height={223}
                            onErr={handleError}
                            hash={hash}
                        />
                    ) : imageContent && !error ? (
                        <CustomCacheImage
                            style={contentStyle.imageView}
                            source={{ uri: imageContent }}
                            onError={handleError}
                        />
                    ) : null}
                    <Text
                        size={Size.Large}
                        fontWeight="700"
                        style={contentStyle.title}
                    >
                        {route.params.lessonName}
                    </Text>
                    <ScrollView style={contentStyle.scrollView}>
                        <TextContent textContent={textContent} />
                    </ScrollView>
                    <View style={contentStyle.btnContainer}>
                        <Button
                            primary
                            style={contentStyle.btn}
                            bordered
                            onPress={onLessonComplete}
                        >
                            <Text color={Colors.text.white} fontWeight="700">
                                Complete Lesson
                            </Text>
                        </Button>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

export default Content;
