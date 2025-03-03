import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useState
} from 'react';
import {
    KeyboardTypeOptions,
    NativeSyntheticEvent,
    Platform,
    StyleProp,
    StyleSheet,
    TextInput,
    TextInputChangeEventData,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

import Text from '@/shared/text';
import { Colors } from '@/theme/colors';
import { COMMON } from '@/utils/common';
import { Constants } from '@/utils/constants';

import { Size } from '../text';

type Props = {
    placeholder?: string;
    style?: StyleProp<ViewStyle>;
    textInputStyle?: StyleProp<TextStyle>;
    Icon?: React.FunctionComponent<{ color?: string }>;
    secureTextEntry?: boolean;
    required?: boolean;
    errorMessage?: string;
    showError?: boolean;
    eyeColor?: string;
    keyboardType?: KeyboardTypeOptions;
    iconPress?: () => void;
    onChange?: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
    onChangeText?: (text: string) => void;
    rightIconPress?: () => void;
    RightIcon?: React.FunctionComponent<{ color?: string }>;
    initialValue?: string;
    editable?: boolean;
    onBlur?: () => void;
    autoCorrect?: boolean;
    autoFocus?: boolean;
    textInputRef?: React.MutableRefObject<TextInput | undefined>;
    multiline?: boolean;
    numberOfLines?: number;
    textInputTestID?: string;
    errorMsgTestID?: string;
    iconPressTestID?: string;
};

const InputComponent: FunctionComponent<Props> = ({
    placeholder = '',
    style,
    textInputStyle,
    Icon,
    secureTextEntry = false,
    required,
    errorMessage = '',
    showError = false,
    keyboardType = 'default',
    iconPress,
    onChange = (_) => {},
    onChangeText = (_) => {},
    rightIconPress,
    RightIcon,
    eyeColor = Colors.icons.eye,
    initialValue = '',
    editable = true,
    onBlur,
    autoCorrect = true,
    autoFocus = false,
    textInputRef,
    multiline = false,
    numberOfLines = 1,
    textInputTestID,
    errorMsgTestID,
    iconPressTestID
}: Props) => {
    const [focused, setFocusState] = useState(false);
    const [inputVal, setInputVal] = useState({
        text: initialValue
    });
    const [showErrorView, setErrorView] = useState(showError);

    useEffect(() => {
        setErrorView(showError);
    }, [showError]);

    const updateInput = useCallback(
        (text: string) => {
            if (text === '') {
                setInputVal({
                    ...inputVal,
                    text
                });
                setErrorView(required ? true : showError);
            } else {
                setInputVal({
                    ...inputVal,
                    text
                });
                setErrorView(showError);
            }
        },
        [inputVal, required, showError]
    );

    const onSubmitEditing = () => {
        if (inputVal.text.trim() === '') {
            setInputVal({
                ...inputVal
            });
            setErrorView(required ? true : showError);
        } else {
            setInputVal({ ...inputVal });
            setErrorView(showError);
        }
    };

    return (
        <View
            style={[
                inputStyle.wrapper,
                showErrorView || showError ? inputStyle.requiredContainer : {},
                showErrorView || showError
                    ? inputStyle.focusedError
                    : focused && inputStyle.focused,
                style
            ]}
        >
            <TouchableOpacity
                activeOpacity={rightIconPress === undefined ? 1 : 0.7}
                onPress={() => {
                    if (rightIconPress === undefined) {
                        return;
                    }

                    rightIconPress();
                }}
            >
                {RightIcon && (
                    <RightIcon
                        color={
                            showErrorView || showError
                                ? Colors.icons.eye_error_border
                                : Colors.icons.eye
                        }
                    />
                )}
            </TouchableOpacity>
            <View style={[inputStyle.container]}>
                <TextInput
                    ref={textInputRef}
                    testID={textInputTestID}
                    placeholder={placeholder}
                    style={[
                        inputStyle.textInput,
                        showErrorView || showError
                            ? inputStyle.textInputError
                            : {},
                        textInputStyle
                    ]}
                    autoFocus={autoFocus}
                    onChange={onChange}
                    placeholderTextColor={
                        showErrorView || showError
                            ? Colors.input.input_placeholder_error
                            : Colors.text.mainDarker
                    }
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    onChangeText={(text) => {
                        updateInput(text);
                        onChangeText(text);
                    }}
                    onFocus={() => setFocusState(true)}
                    onBlur={() => {
                        if (onBlur) {
                            onBlur();
                        }
                        setFocusState(false);
                        onSubmitEditing();
                    }}
                    onSubmitEditing={() => {
                        onSubmitEditing();
                    }}
                    value={inputVal.text}
                    editable={editable}
                    autoCapitalize="none"
                    autoCorrect={autoCorrect}
                    returnKeyType="done"
                    selectionColor={Colors.text.green}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    maxFontSizeMultiplier={Constants.maxFontSizeMultiplier}
                />
                {(showErrorView || showError) && (
                    <Text
                        style={inputStyle.errorText}
                        size={Size.XXXSmall}
                        color={Colors.text.error}
                        fontWeight="500"
                        testID={errorMsgTestID}
                    >
                        {errorMessage}
                    </Text>
                )}
            </View>
            <TouchableOpacity
                testID={iconPressTestID}
                activeOpacity={iconPress === undefined ? 1 : 0.7}
                onPress={() => {
                    if (iconPress === undefined) {
                        return;
                    }

                    iconPress();
                }}
                style={inputStyle.icon}
            >
                {Icon && (
                    <Icon
                        color={
                            showErrorView || showError
                                ? Colors.icons.eye_error_border
                                : !eyeColor
                                ? Colors.text.dark_green
                                : eyeColor
                        }
                    />
                )}
            </TouchableOpacity>
        </View>
    );
};

export default InputComponent;

const inputStyle = StyleSheet.create({
    wrapper: {
        borderWidth: 2,
        borderColor: 'transparent',
        backgroundColor: Colors.extras.white,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        elevation: Platform.OS === 'android' ? 0 : 2,
        shadowColor: Colors.extras.blackCards,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 1,
        shadowOpacity: 0.5,
        height: 61
    },
    container: {
        flexDirection: 'column',
        flex: 1,
        paddingHorizontal: 10,
        position: 'relative',
        justifyContent: 'center'
    },
    requiredContainer: {
        borderColor: Colors.input.error_border,
        backgroundColor: Colors.input.error_bg
    },
    textInput: {
        flex: 1,
        fontFamily: 'Poppins',
        fontWeight: '500',
        color: Colors.text.mainDarker,
        fontSize: 16
    },
    textInputError: {
        paddingBottom: 20
    },
    focused: {
        backgroundColor: Colors.text.white,
        borderColor: Colors.text.green
    },
    focusedError: {
        borderColor: Colors.theme.primary
    },
    errorText: {
        marginBottom: 5,
        position: 'absolute',
        bottom: COMMON.isIos ? 12 : 3,
        left: COMMON.isIos ? 8 : 10,
        zIndex: -1
    },
    icon: {
        marginRight: 5
    }
});
