import React, { FunctionComponent, RefObject } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import Button from '@/shared/button';
import Text, { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

type Props = {
    bottomSheetRef: RefObject<RBSheet>;
    title: string;
    subTitle?: string;
    dismissBtnTitle?: string;
    confirmBtnTitle?: string;
    onDismissBtnHandler?: () => void;
    onConfirmBtnHandler?: () => void;
    confirmBtnStyles?: StyleProp<ViewStyle>;
};

const ConfirmationDialogue: FunctionComponent<Props> = ({
    bottomSheetRef,
    title,
    subTitle,
    dismissBtnTitle,
    confirmBtnTitle,
    onDismissBtnHandler,
    onConfirmBtnHandler,
    confirmBtnStyles
}: Props) => {
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
            <View style={styles.titlesView}>
                <Text
                    size={Size.Large}
                    fontWeight="bold"
                    color={Colors.text.black_gray}
                    style={styles.title}
                >
                    {title}
                </Text>
                {subTitle && (
                    <Text
                        testID="confirmationDialogueSubTitle"
                        size={Size.XXSmall}
                        color={Colors.text.black}
                        style={styles.subTitle}
                    >
                        {subTitle}
                    </Text>
                )}
            </View>
            <View style={styles.buttonsView}>
                <Button
                    block={true}
                    bordered={false}
                    style={styles.firstButton}
                    onPress={onDismissBtnHandler}
                    testID="dismissBtn"
                >
                    <Text color={Colors.text.primary} fontWeight="600">
                        {dismissBtnTitle}
                    </Text>
                </Button>
                <Button
                    block={true}
                    bordered={false}
                    style={[styles.secondButton, confirmBtnStyles]}
                    onPress={onConfirmBtnHandler}
                    testID="confirmBtn"
                >
                    <Text color={Colors.text.white} fontWeight="600">
                        {confirmBtnTitle}
                    </Text>
                </Button>
            </View>
        </RBSheet>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: Colors.theme.app_sheet_background_color
    },
    contentContainer: {
        height: 'auto',
        opacity: 1,
        backgroundColor: Colors.extras.white,
        alignItems: 'center',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40
    },
    draggableIcon: {
        width: 0
    },
    titlesView: {
        width: '80%',
        marginTop: 20
    },
    title: {
        textAlign: 'center'
    },
    subTitle: {
        paddingTop: 20,
        textAlign: 'center'
    },
    buttonsView: {
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 41.86,
        marginBottom: 48
    },
    firstButton: {
        height: 56,
        paddingVertical: 0,
        backgroundColor: Colors.theme.primary_light,
        marginBottom: 16.5
    },
    secondButton: {
        height: 56,
        paddingVertical: 0,
        backgroundColor: Colors.theme.primary,
        borderColor: Colors.button.app_button_primary_border
    }
});

export default ConfirmationDialogue;
