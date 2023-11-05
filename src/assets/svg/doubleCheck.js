import * as React from 'react';
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';

function SvgComponent(props) {
    return (
        <Svg
            width={12}
            height={12}
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <G clipPath="url(#clip0_9_258)" fill="#847F60">
                <Path d="M8.247 3.173a.601.601 0 00-.849-.007L2.963 7.55 1.035 5.553a.601.601 0 10-.868.833l.004.003 2.35 2.436c.113.115.267.18.427.18h.007a.601.601 0 00.42-.173l4.866-4.81a.601.601 0 00.006-.85zM6.13 8.825c.112.115.265.18.425.18h.007a.601.601 0 00.42-.173l4.866-4.81a.601.601 0 00-.842-.856L6.573 7.55l-.158-.164a.601.601 0 10-.868.833l.003.003.58.604z" />
            </G>
            <Defs>
                <ClipPath id="clip0_9_258">
                    <Path fill="#fff" d="M0 0H12V12H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}

export default SvgComponent;
