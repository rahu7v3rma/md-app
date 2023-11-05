import React, { FunctionComponent } from 'react';
import {
    GestureResponderEvent,
    NativeSyntheticEvent,
    StyleProp,
    StyleSheet,
    Text,
    TextLayoutEventData,
    TextStyle
} from 'react-native';

import { Colors } from '@/theme/colors';

export enum Size {
    XXXSmall = 12,
    XXSmall = 14,
    XSmall = 16,
    Small = 18,
    Medium = 20,
    Large = 24,
    XLarge = 28,
    XXLarge = 30,
    XXXLarge = 32,
    X4Large = 34
}

type FontWeight =
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';

type Props = {
    children?: React.ReactNode;
    style?: StyleProp<TextStyle>;
    size?: Size;
    color?: string;
    fontWeight?: FontWeight;
    numberOfLines?: number;
    lineBreakMode?: 'head' | 'middle' | 'tail' | 'clip';
    onPress?: (e?: GestureResponderEvent) => void;
    onTextLayout?: (event: NativeSyntheticEvent<TextLayoutEventData>) => void;
    testID?: string;
};

const TextComponent: FunctionComponent<Props> = ({
    style,
    children,
    size,
    color = Colors.text.black,
    fontWeight,
    numberOfLines,
    lineBreakMode,
    onPress,
    onTextLayout,
    testID
}: Props) => {
    return (
        <Text
            adjustsFontSizeToFit={!numberOfLines}
            onPress={onPress}
            onTextLayout={onTextLayout}
            numberOfLines={numberOfLines}
            lineBreakMode={lineBreakMode}
            style={[
                textStyle.text,
                style,
                {
                    fontSize: size,
                    color: color,
                    fontWeight: fontWeight,
                    lineHeight: size && size > 0 ? size + 8 : undefined
                }
            ]}
            testID={testID}
        >
            {children}
        </Text>
    );
};

export default TextComponent;

const textStyle = StyleSheet.create({
    text: {
        fontFamily: 'Poppins'
    }
});
