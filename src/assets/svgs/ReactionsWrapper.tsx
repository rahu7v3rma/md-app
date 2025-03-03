import React from 'react';
import { View, ViewStyle } from 'react-native';
import { IconProps } from 'stream-chat-react-native';

const ReactionsWrapper: React.FC<IconProps> = ({ children, ...props }) =>
    props.height && props.width && props.height > 18 ? (
        <View style={WrapperStype(props)}>{children}</View>
    ) : (
        <View>{children}</View>
    );
export default ReactionsWrapper;

const WrapperStype = (props: IconProps): ViewStyle => ({
    backgroundColor: props.pathFill === '#005FFF' ? '#D3D3D3' : 'transparent',
    height: props.height && props.height + 10,
    width: props.width && props.width + 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50
});
