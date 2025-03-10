import React, { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Path, Svg } from 'react-native-svg';

import { Colors } from '@/theme/colors';

type Props = {
    width?: number;
    height?: number;
    color?: string;
};

const CrossIcon: FunctionComponent<Props> = ({
    width = 24,
    height = 24,
    color = Colors.text.black
}: Props) => {
    return (
        <Svg
            width={width}
            height={height}
            style={style.root}
            viewBox="0 0 24 24"
            fill="none"
        >
            <Path
                d="M18.7071 6.70711C19.0976 6.31658 19.0976 5.68342 18.7071 5.29289C18.3166 4.90237 17.6834 4.90237 17.2929 5.29289L18.7071 6.70711ZM5.29289 17.2929C4.90237 17.6834 4.90237 18.3166 5.29289 18.7071C5.68342 19.0976 6.31658 19.0976 6.70711 18.7071L5.29289 17.2929ZM17.2929 18.7071C17.6834 19.0976 18.3166 19.0976 18.7071 18.7071C19.0976 18.3166 19.0976 17.6834 18.7071 17.2929L17.2929 18.7071ZM6.70711 5.29289C6.31658 4.90237 5.68342 4.90237 5.29289 5.29289C4.90237 5.68342 4.90237 6.31658 5.29289 6.70711L6.70711 5.29289ZM17.2929 5.29289L5.29289 17.2929L6.70711 18.7071L18.7071 6.70711L17.2929 5.29289ZM18.7071 17.2929L6.70711 5.29289L5.29289 6.70711L17.2929 18.7071L18.7071 17.2929Z"
                fill={color}
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

export default CrossIcon;
