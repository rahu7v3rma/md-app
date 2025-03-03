import React, {
    FunctionComponent,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import {
    Dimensions,
    StyleProp,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';
import {
    FileUploadPreview,
    ImageUploadPreview,
    useMessageInputContext,
    AutoCompleteInput
} from 'stream-chat-react-native';

import Camera from '@/assets/svgs/Camera';
import Send from '@/assets/svgs/Send';
import { Colors } from '@/theme/colors';
import { Constants } from '@/utils/constants';

import MessageQuoted from './messageQuoted';

type Props = Record<string, never>;

const Input: FunctionComponent<Props> = ({}: Props) => {
    const {
        sendMessage,
        text,
        toggleAttachmentPicker,
        closeAttachmentPicker,
        imageUploads,
        fileUploads,
        quotedMessage
    } = useMessageInputContext();

    const [refreshInput, setRefreshInput] = useState(0);

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

    const autoCompleteInputRef = useRef<TextInput>(null);
    useEffect(() => {
        if (quotedMessage) {
            setTimeout(() => {
                autoCompleteInputRef.current?.focus();
            }, 1000);
        }
    }, [quotedMessage]);

    return (
        <View style={styles.fullWidth}>
            <ImageUploadPreview />
            <FileUploadPreview />
            {typeof quotedMessage !== 'boolean' && (
                <MessageQuoted
                    userImage={quotedMessage.user?.image}
                    attachments={quotedMessage.attachments}
                    text={quotedMessage.text}
                />
            )}
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
                    <AutoCompleteInput
                        setInputBoxRef={autoCompleteInputRef}
                        additionalTextInputProps={{
                            maxFontSizeMultiplier:
                                Constants.maxFontSizeMultiplier
                        }}
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
                            if (text.trim()) {
                                sendMessage().then(() => {
                                    setRefreshInput(refreshInput + 1);
                                    closeAttachmentPicker();
                                });
                            }
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
    bottomStyle: {
        bottom: 0
    },
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
        padding: 5,
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
    },
    fullWidth: {
        width: '100%'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    inputContainer: {
        height: 40
    }
});
