import React from 'react';
import Svg, { Defs, ClipPath, Path, G } from 'react-native-svg';
import { IconProps } from 'stream-chat-react-native';

import ReactionsWrapper from './ReactionsWrapper';

const SmileyFace: React.FC<IconProps> = (props) => (
    <ReactionsWrapper {...props}>
        <Svg viewBox="0 0 45 45" {...props}>
            <Defs>
                <ClipPath id="a">
                    <Path d="M0 36h36V0H0v36z" />
                </ClipPath>
            </Defs>
            <G clipPath="url(#a)" transform="matrix(1.25 0 0 -1.25 0 45)">
                <Path
                    d="M36 18c0-9.941-8.059-18-18-18S0 8.059 0 18s8.059 18 18 18 18-8.059 18-18"
                    fill="#ffcc4d"
                />
                <Path
                    d="M10.515 12.379c.045-.18 1.168-4.38 7.485-4.38 6.318 0 7.44 4.2 7.485 4.38a.499.499 0 0 1-.836.477c-.02-.02-1.954-1.856-6.65-1.856-4.693 0-6.63 1.837-6.647 1.856a.505.505 0 0 1-.598.08.5.5 0 0 1-.24-.557M14.5 22.5c0-1.934-1.119-3.5-2.5-3.5s-2.5 1.566-2.5 3.5c0 1.933 1.119 3.5 2.5 3.5s2.5-1.567 2.5-3.5M26.5 22.5c0-1.934-1.119-3.5-2.5-3.5s-2.5 1.566-2.5 3.5c0 1.933 1.119 3.5 2.5 3.5s2.5-1.567 2.5-3.5"
                    fill="#664500"
                />
            </G>
        </Svg>
    </ReactionsWrapper>
);

export default SmileyFace;
