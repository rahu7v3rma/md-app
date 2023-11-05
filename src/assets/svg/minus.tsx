import * as React from 'react';
import Svg, { Circle, G, Rect } from 'react-native-svg';

function Minus() {
    return (
        <Svg width={64} height={64} viewBox="0 0 64 64" fill="none">
            <G filter="url(#filter0_d_3_16)" transform="matrix(1 0 0 -1 16 48)">
                <Circle cx={16} cy={16} r={16} fill="#fff" />
                <Circle
                    cx={16}
                    cy={16}
                    r={14}
                    stroke="#4D4F4D"
                    strokeWidth={4}
                />
            </G>
            <Rect
                x={25.3333}
                y={30.8322}
                width={13.3333}
                height={1.66667}
                rx={0.833333}
                fill="#4D4F4D"
                stroke="#4D4F4D"
            />
        </Svg>
    );
}

export default Minus;
