import React, { FunctionComponent } from 'react';
import { Path, Rect, Svg } from 'react-native-svg';

import { Colors } from '@/theme/colors';

type Props = {
    width?: number;
    height?: number;
    color?: string;
};

const CheckIcon: FunctionComponent<Props> = ({
    width = 97,
    height = 96,
    color = Colors.extras.white
}: Props) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 97 96" fill="none">
            <Rect
                x={0.5}
                width={width}
                height={height}
                rx={32}
                fill={Colors.theme.primary}
            />
            <Path
                d="M62.5 38l-20 20-8-8"
                stroke={color}
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default CheckIcon;
