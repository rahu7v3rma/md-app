import React, { FunctionComponent } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import completed from '@/assets/svg/complete.svg';
import flag from '@/assets/svg/flag.svg';
import lock from '@/assets/svg/lock.svg';
import { CustomCacheImage } from '@/shared';
import { Colors } from '@/theme/colors';

type Props = {
    img: string;
    progress: Boolean;
    complete: Boolean;
    onPress?: () => void;
    testID?: string;
};

const Block: FunctionComponent<Props> = ({
    img,
    progress,
    complete,
    onPress,
    testID
}) => {
    return (
        <TouchableOpacity
            style={[styles.circle, complete && styles.completedCircle]}
            onPress={onPress}
            testID={testID}
            disabled={onPress === undefined}
        >
            <View style={styles.innerCircle}>
                <CustomCacheImage
                    style={styles.image}
                    source={{
                        uri: img
                    }}
                    blurRadius={!progress && !complete ? 2 : 0}
                    resizeMode="contain"
                />
                {!progress && !complete && <View style={styles.blurStyle} />}
            </View>

            <View
                style={[
                    styles.progressIcon,
                    styles.shadowProp,
                    progress && styles.iconInProgress,
                    complete && styles.iconComplete
                ]}
            >
                <SvgXml xml={progress ? flag : complete ? completed : lock} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    blurStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        borderRadius: 44,
        backgroundColor: 'rgba(255, 255, 255, 0.6)'
    },
    circle: {
        width: 100,
        height: 100,
        backgroundColor: Colors.extras.block_locked,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    completedCircle: {
        backgroundColor: Colors.extras.block_complete
    },
    innerCircle: {
        width: 88,
        height: 88,
        borderRadius: 44,
        borderWidth: 4,
        borderColor: Colors.extras.white,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.extras.white,
        overflow: 'hidden'
    },
    image: {
        width: 60,
        height: 60,
        backgroundColor: Colors.extras.white
    },
    progressIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        position: 'absolute',
        bottom: 0,
        zIndex: 1,
        right: 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    shadowProp: {
        shadowColor: '#ccc',
        shadowOffset: { width: 4, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 3
    },
    iconInProgress: {
        backgroundColor: Colors.extras.block_in_progress
    },
    iconComplete: {
        backgroundColor: Colors.extras.block_complete
    }
});

export default Block;
