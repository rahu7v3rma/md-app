import React, { FunctionComponent } from 'react';
import { Path, Svg } from 'react-native-svg';

import { Colors } from '@/theme/colors';

type Props = {
    width?: number;
    height?: number;
    color?: string;
};

const ArrowNext: FunctionComponent<Props> = ({
    width = 24,
    height = 24,
    color = Colors.text.gray
}: Props) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Path
                d="M9.5 7L14.5 12L9.5 17"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default ArrowNext;
