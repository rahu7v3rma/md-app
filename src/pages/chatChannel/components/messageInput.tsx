import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import {
    Dimensions,
    Platform,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';
import {
    FileUploadPreview,
    ImageUploadPreview,
    MessageInput,
    useAttachmentPickerContext,
    useMessageInputContext
} from 'stream-chat-react-native';

import Camera from '@/assets/svgs/Camera';
import Send from '@/assets/svgs/Send';
import { Colors } from '@/theme/colors';

type Props = Record<string, never>;

const Input: FunctionComponent<Props> = ({}: Props) => {
    const {
        sendMessage,
        setText,
        text,
        toggleAttachmentPicker,
        closeAttachmentPicker,
        imageUploads,
        fileUploads
    } = useMessageInputContext();
    const [height, setHeight] = useState<number>(
        Platform.OS === 'android' ? 26 : 30
    );
    const { setBottomInset } = useAttachmentPickerContext();
    const [refreshInput, setRefreshInput] = useState(0);

    useEffect(() => {
        setBottomInset(Platform.OS === 'ios' ? 100 : 50);
    });
    const canSend = useMemo(() => {
        return (
            imageUploads.filter(
                (upload) =>
                    ['uploading', 'upload_failed'].indexOf(upload.state) > -1
            ).length === 0 &&
            fileUploads.filter(
                (upload) =>
                    ['uploading', 'upload_failed'].indexOf(upload.state) > -1
            ).length === 0
        );
    }, [imageUploads, fileUploads]);

    return (
        <View style={styles.wrapper}>
            {imageUploads.length > 0 && <ImageUploadPreview />}
            {fileUploads.length > 0 && <FileUploadPreview />}

            <View style={styles.messageInputContainer}>
                <TouchableOpacity
                    testID="cameraButton"
                    style={[
                        styles.roundedIconBtn,
                        styles.cameraIcon,
                        roundedIconBtnStyles()
                    ]}
                    onPress={toggleAttachmentPicker}
                >
                    <Camera />
                </TouchableOpacity>

                <View style={styles.messageInputView}>
                    <MessageInput
                        additionalTextInputProps={{
                            value: text,
                            placeholderTextColor: Colors.text.gray,
                            onChangeText: (text1) => setText(text1),
                            multiline: true,
                            numberOfLines: 5,
                            style: [styles.messageInput, { maxHeight: height }],
                            placeholder: 'Write a message',
                            onContentSizeChange: (event) => {
                                if (
                                    height >= 24 &&
                                    event.nativeEvent.contentSize.height < 140
                                ) {
                                    setHeight(
                                        event.nativeEvent.contentSize.height +
                                            Number(5)
                                    );
                                }
                            }
                        }}
                        key={refreshInput}
                        showMoreOptions={false}
                        InputButtons={() => null}
                        ShowThreadMessageInChannelButton={() => null}
                        SendButton={() => null}
                    />
                    <TouchableOpacity
                        disabled={!canSend}
                        testID="sendButton"
                        style={[
                            styles.roundedIconBtn,
                            !canSend && {
                                backgroundColor:
                                    Colors.button.app_button_disabled_bg
                            },
                            styles.bottomStyle,
                            roundedIconBtnStyles()
                        ]}
                        onPress={() => {
                            sendMessage().then(() => {
                                setHeight(35);
                                setRefreshInput(refreshInput + 1);
                                closeAttachmentPicker();
                            });
                        }}
                    >
                        <Send />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default Input;

const roundedIconBtnStyles = (): StyleProp<ViewStyle> => {
    return {
        alignSelf: 'flex-end'
    };
};

const styles = StyleSheet.create({
    cameraIcon: {
        bottom: 6
    },
    bottomStyle: { bottom: Platform.OS === 'ios' ? 0 : 5 },
    attachementContainer: {
        position: 'absolute',
        width: Dimensions.get('screen').width
    },
    wrapper: {
        paddingHorizontal: 12,
        paddingTop: 12,
        flexDirection: 'column'
    },
    messageInputContainer: {
        zIndex: 1,
        flexDirection: 'row'
    },
    roundedIconBtn: {
        width: 32,
        height: 32,
        backgroundColor: Colors.button.app_icon_button_background,
        borderWidth: 0.5,
        borderStyle: 'solid',
        borderRadius: 60,
        borderColor: Colors.button.app_button_border,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1
    },
    messageInputView: {
        marginLeft: 12,
        flexDirection: 'row',
        borderColor: Colors.input.input_border,
        borderWidth: 1.5,
        borderStyle: 'solid',
        borderRadius: 16,
        flex: 1,
        paddingBottom: Platform.OS === 'ios' ? 5 : 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    messageInput: {
        flex: 1,
        fontFamily: 'Poppins-SemiBold',
        borderColor: Colors.text.primary,
        fontSize: 16,
        color: Colors.text.black,
        paddingVertical: 0
    }
});
