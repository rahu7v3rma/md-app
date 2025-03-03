import React from 'react';
import Svg, { G, Path } from 'react-native-svg';
import { IconProps } from 'stream-chat-react-native';

import ReactionsWrapper from './ReactionsWrapper';

const SadFace: React.FC<IconProps> = (props) => (
    <ReactionsWrapper {...props}>
        <Svg viewBox="0 0 45 45" {...props}>
            <G clipPath="url(#a)" transform="matrix(1.25 0 0 -1.25 0 45)">
                <Path
                    style={styles.style1}
                    d="M0 0c0-9.941-8.059-18-18-18-9.94 0-18 8.059-18 18 0 9.94 8.06 18 18 18C-8.059 18 0 9.94 0 0"
                    transform="translate(36 18)"
                />
                <Path
                    style={styles.style2}
                    d="M0 0c0-1.934-1.119-3.5-2.5-3.5S-5-1.934-5 0c0 1.933 1.119 3.5 2.5 3.5S0 1.933 0 0"
                    transform="translate(14 19.5)"
                />
                <Path
                    style={styles.style3}
                    d="M0 0c0-1.934-1.119-3.5-2.5-3.5S-5-1.934-5 0c0 1.933 1.119 3.5 2.5 3.5S0 1.933 0 0"
                    transform="translate(27 19.5)"
                />
                <Path
                    style={styles.style4}
                    d="M0 0c-.012.044-1.146 4.379-5.485 4.379C-9.826 4.379-10.96.044-10.97 0a.495.495 0 0 1 .231-.544.51.51 0 0 1 .596.06c.01.007 1.014.863 4.658.863 3.589 0 4.617-.83 4.656-.863A.5.5 0 0 1 0 0"
                    transform="translate(23.485 8.12)"
                />
                <Path
                    style={styles.style5}
                    d="M0 0a5 5 0 0 0-5-5 5 5 0 0 0-5 5c0 2.762 4 10 5 10S0 2.762 0 0"
                    transform="translate(10 6)"
                />
                <Path
                    style={styles.style6}
                    d="M0 0c-5.554 0-7.802 4.367-7.895 4.553a1.001 1.001 0 0 0 1.788.898C-6.033 5.306-4.287 2 0 2a1 1 0 1 0 0-2"
                    transform="translate(30 23)"
                />
                <Path
                    style={styles.style7}
                    d="M0 0a1 1 0 0 0 0 2c5.083 0 5.996 3.12 6.033 3.253.145.528.69.848 1.219.709a.995.995 0 0 0 .718-1.205C7.921 4.563 6.704 0 0 0"
                    transform="translate(6 23)"
                />
            </G>
        </Svg>
    </ReactionsWrapper>
);

export default SadFace;

const styles = {
    style1: {
        fill: '#ffcc4d',
        fillOpacity: 1,
        fillRule: 'nonzero',
        stroke: 'none'
    },
    style2: {
        fill: '#664500',
        fillOpacity: 1,
        fillRule: 'nonzero',
        stroke: 'none'
    },
    style3: {
        fill: '#664500',
        fillOpacity: 1,
        fillRule: 'nonzero',
        stroke: 'none'
    },
    style4: {
        fill: '#664500',
        fillOpacity: 1,
        fillRule: 'nonzero',
        stroke: 'none'
    },
    style5: {
        fill: '#5dadec',
        fillOpacity: 1,
        fillRule: 'nonzero',
        stroke: 'none'
    },
    style6: {
        fill: '#664500',
        fillOpacity: 1,
        fillRule: 'nonzero',
        stroke: 'none'
    },
    style7: {
        fill: '#664500',
        fillOpacity: 1,
        fillRule: 'nonzero',
        stroke: 'none'
    }
};
