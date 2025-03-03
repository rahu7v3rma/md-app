import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
    width?: number;
    height?: number;
    color?: string;
};

const ProfileIcon: React.FunctionComponent<Props> = ({
    width = 14,
    height = 18,
    color = '#6E51D0'
}: Props) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 14 18" fill="none">
            <Path
                d="M7 0C4.566 0 2.593 1.957 2.593 4.371c0 2.415 1.973 4.372 4.407 4.372s4.407-1.957 4.407-4.372C11.407 1.957 9.434 0 7 0zM9.601 10.688a16.635 16.635 0 00-5.202 0l-.185.029C1.786 11.1 0 13.178 0 15.617A2.393 2.393 0 002.403 18h9.194A2.393 2.393 0 0014 15.617c0-2.439-1.787-4.516-4.214-4.9l-.185-.03z"
                fill={color}
            />
        </Svg>
    );
};

export default ProfileIcon;
