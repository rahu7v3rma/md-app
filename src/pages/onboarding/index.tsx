import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent, useCallback, useRef, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';

import { RootNavigationProp } from '@/navigation';
import { CustomStatusBar, Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

import { Pagination, Slide } from './components';

const { width } = Dimensions.get('window');

const carouselItems = [0, 0, 0];

const renderCarouselItem = ({ index }: { index: number }) => {
    return (
        <View key={index} style={styles.carouselItem}>
            <Slide index={index} />
        </View>
    );
};

type Props = Record<string, never>;

const Onboarding: FunctionComponent<Props> = ({}: Props) => {
    const navigation = useNavigation<RootNavigationProp>();

    const carouselRef = useRef<ICarouselInstance>(null);

    const [activeSlide, setActiveSlide] = useState<number>(0);

    const handleStartPress = useCallback(() => {
        navigation.navigate('Main');
    }, [navigation]);

    const handleShowPage = useCallback(
        (pageIndex: number) => {
            carouselRef.current?.scrollTo({ index: pageIndex, animated: true });
        },
        [carouselRef]
    );

    return (
        <GestureHandlerRootView style={styles.root}>
            <CustomStatusBar />
            <View style={styles.carousel}>
                <Carousel
                    loop={false}
                    testID="carosel"
                    ref={carouselRef}
                    data={carouselItems}
                    renderItem={renderCarouselItem}
                    width={width}
                    onProgressChange={(_offsetProgress, absoluteProgress) =>
                        setActiveSlide(Math.round(absoluteProgress))
                    }
                />
                <View style={styles.bottomContent}>
                    <View style={styles.pagination}>
                        <Pagination
                            testID={'pagination'}
                            activePage={activeSlide}
                            totalPages={carouselItems.length}
                            onShowPage={handleShowPage}
                        />
                    </View>
                    {activeSlide === 2 ? (
                        <TouchableOpacity
                            style={styles.buttonNext}
                            onPress={handleStartPress}
                            testID="startButton"
                        >
                            <Text
                                style={styles.buttonText}
                                size={Size.XXSmall}
                                fontWeight="600"
                                color={Colors.text.white}
                            >
                                Let's Start
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.buttonNext}
                            testID="nextButton"
                            onPress={() => {
                                carouselRef.current?.next();
                            }}
                        >
                            <Text
                                style={styles.buttonText}
                                size={Size.XXSmall}
                                fontWeight="600"
                                color={Colors.text.white}
                            >
                                Next
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    root: {
        alignItems: 'center'
    },
    carousel: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    bottomContent: {
        position: 'absolute',
        bottom: 20,
        justifyContent: 'space-between'
    },
    pagination: {
        marginBottom: 45
    },
    buttonNext: {
        width: 300,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.theme.primary,
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 10
    },
    buttonText: {
        textAlign: 'center'
    },
    carouselItem: {
        marginBottom: 100,
        flex: 1
    }
});

export default Onboarding;
