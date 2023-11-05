import React, { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Path, Svg } from 'react-native-svg';

import { Colors } from '@/theme/colors';

type Props = {
    width?: number;
    height?: number;
};

const ChevronDown: FunctionComponent<Props> = ({
    width = 12,
    height = 8
}: Props) => {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 12 8"
            fill="none"
            style={style.root}
        >
            <Path
                d="M11 1.5L6 6.5L1 1.5"
                stroke={Colors.theme.primary}
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </Svg>
    );
};

const style = StyleSheet.create({
    root: {
        width: 'auto',
        height: 'auto'
    }
});

export default ChevronDown;
