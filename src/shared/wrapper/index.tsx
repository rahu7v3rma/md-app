import React, { FunctionComponent } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet
} from 'react-native';

type Props = {
    loading: boolean;
    children?: React.ReactNode;
    onRefresh?: () => void;
    onScroll?: (event: object) => void;
};

const Wrapper: FunctionComponent<Props> = ({
    loading,
    children,
    onRefresh,
    onScroll
}: Props) => {
    return (
        <ScrollView
            scrollEnabled={true}
            style={styles.root}
            refreshControl={
                onRefresh && (
                    <RefreshControl refreshing={false} onRefresh={onRefresh} />
                )
            }
            bounces={true}
            onScrollEndDrag={onScroll}
        >
            {loading && <ActivityIndicator style={styles.loader} />}
            {children}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    root: {
        height: '100%'
    },
    loader: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0
    }
});

export default Wrapper;
