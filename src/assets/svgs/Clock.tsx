import React, { FunctionComponent } from 'react';
import { Path, Svg } from 'react-native-svg';

type Props = {
    width?: number;
    height?: number;
    color?: string;
};

const ClockIcon: FunctionComponent<Props> = ({
    width = 11,
    height = 12,
    color = '#6E51D0'
}: Props) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 11 12" fill="none">
            <Path
                d="M0.776001 6.76999C0.776001 4.16599 2.896 2.04599 5.5 2.04599C8.104 2.04599 10.224 4.171 10.224 6.776C10.224 9.38 8.104 11.5 5.5 11.5C2.896 11.5 0.776001 9.37499 0.776001 6.76999ZM5.5 7.354C5.923 7.354 6.271 7.00601 6.271 6.58301V3.66699C6.271 3.24299 5.923 2.896 5.5 2.896C5.077 2.896 4.729 3.24299 4.729 3.66699V6.58301C4.729 7.00601 5.077 7.354 5.5 7.354Z"
                fill={color}
                stroke={color}
                stroke-width="0.666667"
            />
            <Path
                d="M7.18597 0.678986H3.81403C3.76503 0.678986 3.72699 0.64201 3.72699 0.59201C3.72699 0.53701 3.77103 0.5 3.81403 0.5H7.18597C7.23497 0.5 7.27197 0.537006 7.27197 0.587006C7.27197 0.642006 7.22897 0.678986 7.18597 0.678986Z"
                fill={color}
                stroke={color}
                stroke-width="0.666667"
            />
        </Svg>
    );
};

export default ClockIcon;
