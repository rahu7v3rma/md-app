import React, { FunctionComponent, useRef, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { BackIcon, CrossIcon } from '@/assets/svgs';
import { useAppDispatch } from '@/hooks';
import { clearSearchText, searchFilterAction } from '@/reducers/user';
import InputComponent from '@/shared/input';
import { Colors } from '@/theme/colors';

type Props = {
    onBack?: () => void;
};

const ChatSearchHeader: FunctionComponent<Props> = ({ onBack }: Props) => {
    const inputRef = useRef<TextInput>();
    const dispatch = useAppDispatch();
    const [displayCrossIcon, setDisplayCrossIcon] = useState<boolean>(false);
    const onCloseClearText = () => {
        inputRef?.current?.clear();
        setDisplayCrossIcon(false);
        dispatch(clearSearchText());
    };

    React.useEffect(() => {
        return () => {
            dispatch(clearSearchText());
        };
    }, [dispatch]);

    const onChange = (text: string) => {
        setDisplayCrossIcon(text?.length > 0);
        dispatch(searchFilterAction(text));
    };

    return (
        <View style={styles.header}>
            <TouchableOpacity
                testID="backButtonTestId"
                onPress={onBack}
                style={styles.roundedIconBtn}
            >
                <BackIcon />
            </TouchableOpacity>
            <InputComponent
                textInputTestID="searchInputTestId"
                textInputRef={inputRef}
                style={styles.textInput}
                textInputStyle={styles.textInputStyle}
                placeholder={'Search'}
                onChangeText={(text) => onChange(text)}
                autoFocus={true}
            />
            <TouchableOpacity
                onPress={onCloseClearText}
                style={[
                    styles.roundedIconBtn,
                    stylesWithOps(displayCrossIcon).clearBtn
                ]}
                testID="clearButtonTestId"
            >
                <CrossIcon />
            </TouchableOpacity>
        </View>
    );
};

export default ChatSearchHeader;

const styles = StyleSheet.create({
    roundedIconBtn: {
        backgroundColor: Colors.button.app_icon_button_background,
        borderStyle: 'solid',
        borderRadius: 60,
        borderColor: Colors.button.app_button_border,
        alignItems: 'center',
        justifyContent: 'center',
        width: 48,
        height: 48,
        borderWidth: 0
    },
    header: {
        zIndex: 2,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 9,
        borderBottomColor: Colors.extras.border_color,
        borderBottomWidth: 2,
        backgroundColor: Colors.extras.white
    },
    textInputStyle: {
        width: '100%',
        fontSize: 24
    },
    textInput: {
        fontSize: 24,
        fontWeight: '500',
        fontFamily: 'Poppins',
        width: '75%',
        backgroundColor: 'transparent',
        borderWidth: 0,
        borderRadius: 0,
        borderBottomWidth: 0
    }
});

const stylesWithOps = (displayCrossIcon: boolean) =>
    StyleSheet.create({
        clearBtn: {
            opacity: displayCrossIcon ? 1 : 0
        }
    });
