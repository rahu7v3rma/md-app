import React, { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Path, Svg } from 'react-native-svg';

type Props = {
    width?: number;
    height?: number;
};

const PlayIcon: FunctionComponent<Props> = ({
    width = 12,
    height = 14
}: Props) => {
    return (
        <Svg
            width={width}
            height={height}
            style={style.root}
            viewBox="0 0 12 14"
            fill="none"
        >
            <Path
                d="M1.83594 13.2236C2.14355 13.2236 2.41016 13.1279 2.75879 12.9229L10.9004 8.20605C11.5088 7.85059 11.7891 7.5498 11.7891 7.07129C11.7891 6.59277 11.5088 6.29199 10.9004 5.93652L2.75879 1.21973C2.41016 1.02148 2.14355 0.918945 1.83594 0.918945C1.23438 0.918945 0.776367 1.37695 0.776367 2.12891V12.0205C0.776367 12.7656 1.23438 13.2236 1.83594 13.2236Z"
                fill="white"
            />
        </Svg>
    );
};

const style = StyleSheet.create({
    root: {
        width: 'auto',
        height: 'auto'
    }
});

export default PlayIcon;
