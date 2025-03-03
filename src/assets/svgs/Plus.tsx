import React, { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Path, Svg } from 'react-native-svg';

type Props = {
    width?: number;
    height?: number;
};

const Plus: FunctionComponent<Props> = ({ width = 12, height = 12 }: Props) => {
    return (
        <Svg
            width={width}
            height={height}
            style={style.root}
            viewBox="0 0 14 14"
            fill="none"
        >
            <Path
                d="M1 7H13M7 1V13"
                stroke="white"
                strokeWidth={2}
                strokeLinecap="round"
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

export default Plus;
