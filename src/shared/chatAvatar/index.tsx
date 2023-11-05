import React, { FunctionComponent } from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import DefaultAvatar from '@/assets/images/default_avatar.jpg';
import { PlatformImage } from '@/shared';
import { Colors } from '@/theme/colors';

type Props = {
    width?: number;
    height?: number;
    path?: string;
    online?: boolean;
    style?: StyleProp<ViewStyle>;
};

const ChatAvatar: FunctionComponent<Props> = ({
    width,
    height,
    path,
    online,
    style
}: Props) => {
    const borderRadius = width ? width / 2 : 0;

    return (
        <>
            <View style={[styles.wrapper, style]}>
                {path ? (
                    <PlatformImage
                        style={{ borderRadius, width, height }}
                        imageId={path}
                        width={width}
                        height={height}
                    />
                ) : (
                    <Image
                        style={{ borderRadius, width, height }}
                        source={DefaultAvatar}
                    />
                )}
                {online && <View testID="online" style={styles.onlineDot} />}
            </View>
        </>
    );
};

export default ChatAvatar;

const styles = StyleSheet.create({
    wrapper: {
        justifyContent: 'center'
    },
    onlineDot: {
        backgroundColor: Colors.icons.green_check_mark,
        borderStyle: 'solid',
        borderColor: Colors.extras.white,
        width: 12,
        borderWidth: 2,
        height: 12,
        borderRadius: 12,
        zIndex: 1,
        position: 'absolute',
        top: 0,
        transform: [{ translateY: -3 }, { translateX: -3 }]
    }
});
