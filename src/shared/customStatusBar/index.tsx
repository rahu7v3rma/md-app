import React, { FunctionComponent } from 'react';
import { StatusBar } from 'react-native';

import { Colors } from '@/theme/colors';

type BarStyle = 'dark-content' | 'default' | 'light-content';

type Props = {
    backgroundColor?: string;
    barStyle?: BarStyle;
};

const CustomStatusBar: FunctionComponent<Props> = ({
    backgroundColor = Colors.statusBar.white,
    barStyle = 'dark-content'
}: Props) => {
    return <StatusBar backgroundColor={backgroundColor} barStyle={barStyle} />;
};

export default CustomStatusBar;
