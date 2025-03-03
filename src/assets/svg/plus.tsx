import * as React from 'react';
import Svg, { Circle, G, Path } from 'react-native-svg';

function Plus() {
    return (
        <Svg width={64} height={64} viewBox="0 0 64 64" fill="none">
            <G filter="url(#filter0_d_3_30)" transform="matrix(1 0 0 -1 16 48)">
                <Circle cx={16} cy={16} r={16} fill="#fff" />
                <Circle
                    cx={16}
                    cy={16}
                    r={14}
                    stroke="#4D4F4D"
                    strokeWidth={4}
                />
            </G>
            <Path
                d="M26 32h12m-6-6v12"
                stroke="#4D4F4D"
                strokeWidth={2}
                strokeLinecap="round"
            />
        </Svg>
    );
}

export default Plus;
