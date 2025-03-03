import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

import { Colors } from '@/theme/colors';

type Props = {
    width?: number;
    height?: number;
    color?: string;
};

const LoginLogoIcon: React.FunctionComponent<Props> = ({
    width = 96,
    height = 96,
    color = Colors.theme.primary
}: Props) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 96 96" fill="none">
            <Rect width={96} height={96} rx={32} fill="#fff" />
            <Path
                d="M37.645 65H26l2.874-33H39.34l8.623 16.279L56.218 32h10.686L70 65H58.429l-1.032-13.775L50.395 65h-4.938L38.53 51.225 37.645 65z"
                fill={color}
            />
        </Svg>
    );
};

export default LoginLogoIcon;
