import React, { FC } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import { CheckIcon } from '@/assets/svgs';
import { Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

type Props = {
    enteredEmail: string;
};

const SentInstructions: FC<Props> = ({ enteredEmail = '' }: Props) => {
    return (
        <View style={sentInstructionsStyles.wrapper}>
            <SafeAreaView style={sentInstructionsStyles.container}>
                <View style={sentInstructionsStyles.centeredContainer}>
                    <View style={sentInstructionsStyles.checkBox}>
                        <CheckIcon />
                    </View>
                    <Text
                        style={sentInstructionsStyles.titleText}
                        size={Size.XLarge}
                        fontWeight="700"
                    >
                        {'Please check\nyour email!'}
                    </Text>
                    <Text
                        style={sentInstructionsStyles.subTitleText}
                        size={Size.XSmall}
                        fontWeight="400"
                        color={Colors.text.gray_Base}
                    >
                        If the email address{' '}
                        <Text
                            style={sentInstructionsStyles.emailText}
                            size={Size.XSmall}
                            fontWeight="600"
                            color={Colors.text.primary}
                        >
                            {enteredEmail}{' '}
                        </Text>
                        was found on our servers, a reset email will be sent to
                        it (please also check your spam folder if you can't see
                        the message)
                    </Text>
                </View>
            </SafeAreaView>
        </View>
    );
};
export default SentInstructions;

const sentInstructionsStyles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: Colors.theme.app_background
    },
    container: {
        flex: 1,
        marginHorizontal: 20,
        marginBottom: 25,
        position: 'relative'
    },
    centeredContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20
    },
    titleText: {
        textAlign: 'center'
    },
    subTitleText: {
        marginTop: 10,
        textAlign: 'center'
    },
    checkBox: {
        height: 96,
        width: 96,
        borderRadius: 35,
        borderWidth: 3,
        borderBottomWidth: 10,
        borderColor: Colors.extras.success_lighter,
        backgroundColor: Colors.extras.success_lightest,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 150
    },
    emailText: {
        marginTop: 10,
        textAlign: 'center',
        textDecorationLine: 'underline'
    }
});
