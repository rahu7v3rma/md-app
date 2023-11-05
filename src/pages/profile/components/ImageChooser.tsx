import { useFocusEffect } from '@react-navigation/native';
import React, { FunctionComponent, RefObject } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import Toast from 'react-native-toast-message';

import { ChoosePhoto, TakePhoto } from '@/assets/svgs';
import { pickImage } from '@/services/image';
import { Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

type Props = {
    bottomSheetRef: RefObject<RBSheet>;
    closeChooser: () => void;
    onImageSelected: (image: ImageOrVideo) => void;
    cropping?: boolean;
};

const ImageChooser: FunctionComponent<Props> = ({
    bottomSheetRef,
    closeChooser,
    onImageSelected,
    cropping
}: Props) => {
    useFocusEffect(
        React.useCallback(() => {
            return () => {
                bottomSheetRef.current?.close();
            };
        }, [bottomSheetRef])
    );

    const choosePhoto = async () => {
        try {
            const result = await pickImage({ type: 'gallery', cropping });
            if (result) {
                onImageSelected(result);
                closeChooser();
            }
        } catch (error) {
            closeChooser();

            // When gallery permission access required
            const errorObject = JSON.parse(
                JSON.stringify(error, ['message', 'code', 'name'])
            );

            if (errorObject.code === 'E_NO_LIBRARY_PERMISSION') {
                Toast.show({
                    type: 'info',
                    //text1: "To use a photo we need access to your library. Go to settings to enable permissions",
                    text1: "To use a photo, go to your phone's settings and allow library access",
                    position: 'bottom'
                });
            }
        }
    };

    const takePhoto = async () => {
        try {
            const result = await pickImage({ type: 'camera', cropping });
            if (result) {
                onImageSelected(result);
                closeChooser();
            }
        } catch (error) {
            closeChooser();

            const errorObject = JSON.parse(
                JSON.stringify(error, ['message', 'code', 'name'])
            );

            if (errorObject.code === 'E_NO_CAMERA_PERMISSION') {
                Toast.show({
                    type: 'info',
                    text1: "To take a photo, go to your phone's settings and allow camera access",
                    position: 'bottom'
                });
            }
        }
    };

    return (
        <RBSheet
            ref={bottomSheetRef}
            closeOnDragDown={true}
            animationType={'fade'}
            closeOnPressMask={true}
            customStyles={{
                wrapper: styles.wrapper,
                container: styles.contentContainer,
                draggableIcon: styles.draggableIcon
            }}
        >
            <View style={styles.imageSelectContainer}>
                <TouchableOpacity
                    testID="choosePhoto"
                    onPress={choosePhoto}
                    style={styles.optionView}
                >
                    <ChoosePhoto width={18} height={18} />
                    <Text
                        style={styles.titleStyle}
                        size={Size.XXSmall}
                        color={Colors.text.black}
                        fontWeight="600"
                    >
                        Choose a photo
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    testID="takePhoto"
                    onPress={takePhoto}
                    style={styles.optionView}
                >
                    <TakePhoto width={18} height={18} />
                    <Text
                        style={styles.titleStyle}
                        size={Size.XXSmall}
                        color={Colors.text.black}
                        fontWeight="600"
                    >
                        Take a picture
                    </Text>
                </TouchableOpacity>
            </View>
        </RBSheet>
    );
};

const styles = StyleSheet.create({
    titleStyle: {
        marginLeft: 15
    },
    optionView: {
        marginTop: 34,
        flexDirection: 'row',
        marginHorizontal: 20
    },
    wrapper: {
        backgroundColor: Colors.theme.app_sheet_background_color
    },
    draggableIcon: {
        width: 60
    },
    imageSelectContainer: {
        backgroundColor: 'white',
        flex: 1,
        width: Dimensions.get('window').width - 20,
        borderRadius: 40
    },
    contentContainer: {
        height: 170,
        opacity: 1,
        marginBottom: 20,
        backgroundColor: 'transparent',
        alignItems: 'center'
    }
});

export default ImageChooser;
