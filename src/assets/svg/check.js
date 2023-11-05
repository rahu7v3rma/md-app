import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function SvgComponent(props) {
    return (
        <Svg
            width={9}
            height={8}
            viewBox="0 0 9 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M8.247 1.173a.601.601 0 00-.849-.007L2.963 5.549 1.035 3.553a.601.601 0 10-.868.833l.004.003 2.35 2.436c.113.115.267.18.427.18h.007a.601.601 0 00.42-.173l4.866-4.81a.601.601 0 00.006-.85z"
                fill="#847F60"
            />
        </Svg>
    );
}

export default SvgComponent;
