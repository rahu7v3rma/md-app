import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import { RootNavigationProp } from '@/navigation';
import { CustomStatusBar } from '@/shared';
import { Colors } from '@/theme/colors';

import { ChatSearchHeader, UserItemList } from './components';

type Props = Record<string, never>;

const ChatSearch: FunctionComponent<Props> = ({}: Props) => {
    const navigation = useNavigation<RootNavigationProp>();
    return (
        <SafeAreaView style={styles.root}>
            <CustomStatusBar />
            <ChatSearchHeader
                onBack={() => navigation.canGoBack() && navigation.goBack()}
            />
            <UserItemList />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: {
        backgroundColor: Colors.extras.white,
        flex: 1
    }
});

export default ChatSearch;
