import React, { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Circle, Svg } from 'react-native-svg';

type Props = {
    width?: number;
    height?: number;
};

const SliderMarker: FunctionComponent<Props> = ({
    width = 9,
    height = 9
}: Props) => {
    return (
        <Svg
            width={width}
            height={height}
            style={style.root}
            viewBox="0 0 9 9"
            fill="none"
        >
            <Circle cx="4.5" cy="4.5" r="4.5" fill="white" />
        </Svg>
    );
};

export default SliderMarker;

const style = StyleSheet.create({
    root: {
        width: 'auto',
        height: 'auto'
    }
});
