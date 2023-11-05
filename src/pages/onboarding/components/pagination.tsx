import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/theme/colors';

import PaginationDot from './paginationDot';

type Props = {
    activePage: number;
    totalPages: number;
    onShowPage: (pageIndex: number) => void;
    testID?: string;
};

const Pagination: FunctionComponent<Props> = ({
    activePage,
    totalPages,
    onShowPage,
    testID
}: Props) => {
    return (
        <View testID={testID} pointerEvents={'box-none'} style={styles.root}>
            {Array.from({ length: totalPages }, (_page, idx) => (
                <PaginationDot
                    key={`pagination-dot-${idx}`}
                    dotStyle={styles.dot}
                    active={idx === activePage}
                    activeAnimatedStyle={{
                        color: Colors.pagination.active_dot,
                        transform: {
                            rotationDegrees: -45
                        }
                    }}
                    inactiveAnimatedStyle={{
                        color: Colors.pagination.inactive_dot,
                        transform: {
                            rotationDegrees: 0
                        }
                    }}
                    onPress={() => onShowPage(idx)}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 30,
        flexDirection: 'row'
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 2
    }
});

export default Pagination;
