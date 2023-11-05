import React, { FunctionComponent, useRef } from 'react';
import {
    StyleProp,
    StyleSheet,
    TextStyle,
    View,
    ViewStyle
} from 'react-native';
import WebView from 'react-native-webview';

type Props = {
    videoId: string;
    height: number;
    style?: StyleProp<TextStyle>;
    videoPlayerstyle?: StyleProp<ViewStyle>;
    onErr?: () => void;
    hash?: string;
};
const VideoPlayer: FunctionComponent<Props> = ({
    videoId,
    height,
    style,
    videoPlayerstyle,
    onErr,
    hash = ''
}: Props) => {
    const webRef = useRef<WebView>();
    let params: string =
        'api=1&autoplay=0&byline=0&portrait=0&title=0&playsinline=1&autopause=true';
    if (hash) {
        const h = `&h=${hash}`;
        params = params.concat(h);
    }
    const url: string = `https://player.vimeo.com/video/${videoId}?${params}`;

    return (
        <View
            style={[
                styles.root,
                style,
                {
                    height: height
                }
            ]}
        >
            <WebView
                style={[styles.vimeoPlayer, videoPlayerstyle]}
                allowsFullscreenVideo={true}
                source={{ uri: url }}
                javaScriptEnabled={true}
                ref={webRef as any}
                scrollEnabled={false}
                allowsInlineMediaPlayback={true}
                contentMode="mobile"
                onHttpError={() => onErr && onErr()}
            />
        </View>
    );
};

export default VideoPlayer;

const styles = StyleSheet.create({
    root: {
        borderRadius: 8,
        overflow: 'hidden',
        width: '100%'
    },
    vimeoPlayer: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    }
});
