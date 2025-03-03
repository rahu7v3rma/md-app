import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
    width?: number;
    height?: number;
    color?: string;
};
const LogoutIcon: React.FunctionComponent<Props> = ({
    width = 21,
    height = 21,
    color = '#6E51D0'
}: Props) => {
    return (
        <Svg width={width} height={height} fill="none">
            <Path
                fill={color}
                d="M3.938 18.375a1.26 1.26 0 0 1-.92-.394 1.26 1.26 0 0 1-.393-.919V3.938c0-.35.131-.656.394-.918a1.26 1.26 0 0 1 .918-.394h6.366v1.313H3.937v13.124h6.366v1.313H3.937zm10.63-4.047-.94-.94 2.231-2.232H8.203V9.844h7.613l-2.232-2.231.941-.941 3.85 3.85-3.806 3.806z"
            />
        </Svg>
    );
};

export default LogoutIcon;
