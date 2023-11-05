import React from 'react';
import WebView from 'react-native-webview';
import { act, create } from 'react-test-renderer';

import VideoPlayer from '@/shared/videoPlayer';

test('snapshot', () => {
    expect(create(<VideoPlayer />).toJSON()).toMatchSnapshot();
});

test('renders the video with the correct URL', () => {
    const mockVideoId = 'mockVideoId';
    const params =
        'api=1&autoplay=0&byline=0&portrait=0&title=0&playsinline=1&autopause=true';
    expect(
        create(<VideoPlayer videoId={mockVideoId} />).root.findByType(WebView)
            .props.source
    ).toMatchObject({
        uri: `https://player.vimeo.com/video/${mockVideoId}?${params}`
    });
});

test('applies custom styles to the video player', () => {
    expect(
        create(
            <VideoPlayer videoPlayerstyle={{ borderColor: 'blue' }} />
        ).root.findByType(WebView).props.style
    ).toEqual([
        {
            width: '100%',
            height: '100%',
            resizeMode: 'cover'
        },
        { borderColor: 'blue' }
    ]);
});

test('calls the onErr callback on HTTP error', async () => {
    const mockOnErr = jest.fn();
    const videoPlayerComponent = create(
        <VideoPlayer onErr={mockOnErr} />
    ).root.findByType(WebView);
    await act(() => videoPlayerComponent.props.onHttpError());
    expect(mockOnErr).toBeCalled();
});
