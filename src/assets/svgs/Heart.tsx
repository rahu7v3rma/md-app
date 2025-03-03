import React from 'react';
import { IconProps, RootPath, RootSvg } from 'stream-chat-react-native';

import ReactionsWrapper from './ReactionsWrapper';

const Heart: React.FC<IconProps> = (props) => (
    <ReactionsWrapper {...props}>
        <RootSvg {...props} viewBox="0 0 0.563 0.563">
            <RootPath
                d="M0.522 0.253c-0.044 0.084 -0.161 0.199 -0.228 0.26a0.019 0.019 0 0 1 -0.025 0C0.202 0.452 0.085 0.337 0.041 0.253 -0.056 0.068 0.188 -0.056 0.281 0.129c0.094 -0.186 0.337 -0.062 0.24 0.124z"
                pathFill={'#F15268'}
            />
        </RootSvg>
    </ReactionsWrapper>
);

export default Heart;
