import React, { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Path, Svg } from 'react-native-svg';

import { Colors } from '@/theme/colors';

type Props = {
    width?: number;
    height?: number;
};

const Send: FunctionComponent<Props> = ({ width = 20, height = 20 }: Props) => {
    return (
        <Svg
            width={width}
            height={height}
            style={style.root}
            viewBox="0 0 20 20"
            fill="none"
        >
            <Path
                d="M10.275 9.99991H6.33364L5.01563 4.75654C5.00719 4.72607 5.00205 4.69478 5.0003 4.66321C4.98563 4.18254 5.51497 3.8492 5.97364 4.0692L18.3337 9.99991L5.97364 15.9306C5.5203 16.1486 4.99763 15.8246 5.0003 15.3526C5.00165 15.3104 5.00906 15.2687 5.0223 15.2286L6.00031 11.9999"
                fill={Colors.theme.primary}
                fillOpacity={0.24}
            />
            <Path
                d="M10.275 9.99991H6.33364L5.01563 4.75654C5.00719 4.72607 5.00205 4.69478 5.0003 4.66321C4.98563 4.18254 5.51497 3.8492 5.97364 4.0692L18.3337 9.99991L5.97364 15.9306C5.5203 16.1486 4.99763 15.8246 5.0003 15.3526C5.00165 15.3104 5.00906 15.2687 5.0223 15.2286L6.00031 11.9999"
                fill={Colors.theme.primary}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
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

export default Send;
