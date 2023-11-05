import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image as PickedImage } from 'react-native-image-crop-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import { SvgXml } from 'react-native-svg';

import camera from '@/assets/svg/camera.svg';
import b_delete from '@/assets/svg/delete.svg';
import h_delete from '@/assets/svg/h_delete.svg';
import ImageChooser from '@/pages/profile/components/ImageChooser';
import PlatformImage from '@/shared/platformImage';
import { Colors } from '@/theme/colors';

type Props = {
    onImagePicked: (image_data: string, image_mime: string) => void;
    imageSource?: string;
    imageChooserTouchID?: string;
    deleteImageID?: string;
};

const ImagePicker: FunctionComponent<Props> = ({
    onImagePicked,
    imageSource,
    imageChooserTouchID,
    deleteImageID
}: Props) => {
    const imageChooser = useRef<RBSheet>(null);

    const [imagePath, setImagePath] = useState<string | undefined>();

    const onImageSelected = useCallback(
        (image: PickedImage) => {
            onImagePicked(image.data!, image.mime);
            setImagePath(image.path);
        },
        [onImagePicked]
    );

    const [imageWidth, setImageWidth] = useState<number>(0);
    useEffect(() => {
        if (imagePath) {
            Image.getSize(imagePath, (width) => {
                if (width) {
                    setImageWidth(width);
                }
            });
        }
    }, [imagePath]);
    const imageStyles = { ...styles.image, width: imageWidth };

    return (
        <View style={styles.root}>
            <View style={styles.bodyWrapper}>
                <TouchableOpacity
                    style={[
                        styles.imageWrapper,
                        imagePath && styles.imageWrapperSelected
                    ]}
                    testID={imageChooserTouchID}
                    onPress={() => {
                        imageChooser.current?.open();
                    }}
                >
                    {imagePath ? (
                        <>
                            <Image
                                style={imageStyles}
                                source={{ uri: imagePath }}
                            />
                            <View style={styles.deleteButtonWrapper}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setImagePath('');
                                    }}
                                    testID={deleteImageID}
                                    style={styles.deleteButton}
                                >
                                    <SvgXml xml={h_delete} />
                                    <SvgXml xml={b_delete} />
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : imageSource ? (
                        <PlatformImage
                            imageId={imageSource}
                            style={styles.loggedImage}
                        />
                    ) : (
                        <TouchableOpacity
                            testID="imagePickerButton"
                            onPress={() => {
                                imageChooser.current?.open();
                            }}
                        >
                            <SvgXml xml={camera} />
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>
            </View>
            <View style={styles.footerStyle}>
                <ImageChooser
                    closeChooser={() => imageChooser.current?.close()}
                    onImageSelected={onImageSelected}
                    bottomSheetRef={imageChooser}
                    cropping={false}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        paddingVertical: 10
    },
    bodyWrapper: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: Colors.extras.white,
        alignItems: 'center',
        borderRadius: 12
    },
    imageWrapper: {
        height: 209,
        width: '100%',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        height: '100%',
        resizeMode: 'contain'
    },
    imageWrapperSelected: {
        borderWidth: 0
    },
    deleteButtonWrapper: {
        width: 40,
        height: 40,
        backgroundColor: Colors.button.app_button_primary_border,
        position: 'absolute',
        top: 0,
        right: 0,
        margin: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    deleteButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
    },
    footerStyle: {
        backgroundColor: Colors.button.app_icon_button_background
    },
    loggedImage: {
        width: '100%',
        height: 204
    }
});

export default ImagePicker;
