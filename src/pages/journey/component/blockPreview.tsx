import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    PanResponder,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from 'react-native';

import { CustomCacheImage, Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

type Props = {
    onDismiss: () => void;
    visible: boolean;
    title: string;
    description: string;
    blockLevel: number;
    img: string;
    testID?: string;
};

const BlockPreview: FunctionComponent<Props> = ({
    onDismiss,
    visible,
    title,
    description,
    blockLevel,
    img,
    testID
}) => {
    const screenHeight = Dimensions.get('screen').height;
    const [panY] = useState(new Animated.Value(screenHeight));

    const resetPositionAnim = Animated.timing(panY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
    });

    const closeAnim = Animated.timing(panY, {
        toValue: screenHeight,
        duration: 500,
        useNativeDriver: true
    });

    const translateY = panY.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [0, 0, 1]
    });

    const handleDismiss = () => closeAnim.start(() => onDismiss());

    useEffect(() => {
        if (visible) {
            resetPositionAnim.start();
        }
    }, [visible, resetPositionAnim]);

    const panResponders = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => false,
            onPanResponderMove: Animated.event([null, { dy: panY }], {
                useNativeDriver: false
            }),
            onPanResponderRelease: (_, gs) => {
                if (gs.dy > 0 && gs.vy > 2) {
                    return handleDismiss();
                }
                return resetPositionAnim.start();
            }
        })
    ).current;

    return (
        <Modal
            animated
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={handleDismiss}
            testID={testID}
        >
            <TouchableWithoutFeedback
                onPress={handleDismiss}
                accessible={false}
            >
                <View style={styles.centeredView}>
                    <Animated.View
                        style={{
                            ...styles.modalView,
                            transform: [{ translateY: translateY }]
                        }}
                        {...panResponders.panHandlers}
                    >
                        <View style={styles.horizontalLine} />
                        <Text
                            style={styles.level2}
                            size={Size.Medium}
                            fontWeight="700"
                        >
                            LEVEL {blockLevel} - {title}
                        </Text>
                        <CustomCacheImage
                            resizeMode="contain"
                            source={{
                                uri: img
                            }}
                            style={styles.imageStyle}
                        />
                        <Text
                            style={styles.description}
                            size={Size.XSmall}
                            fontWeight="400"
                            color={Colors.text.black}
                        >
                            {description}
                        </Text>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        position: 'absolute',
        zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        flex: 1,
        justifyContent: 'space-between',
        margin: 10,
        backgroundColor: Colors.text.white,
        borderRadius: 50,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: 380,
        minHeight: 340,
        position: 'absolute',
        bottom: 10
    },
    level2: {
        textAlign: 'center'
    },
    description: {
        textAlign: 'center'
    },
    horizontalLine: {
        borderBottomColor: Colors.text.white,
        borderBottomWidth: 6,
        width: 60,
        borderRadius: 90,
        position: 'absolute',
        top: -15
    },
    imageStyle: {
        height: 100,
        width: 100
    }
});

export default BlockPreview;
