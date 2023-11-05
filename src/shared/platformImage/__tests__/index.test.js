import React from 'react';
import { Image } from 'react-native';
import { act, create } from 'react-test-renderer';

import loadingIndicatorSource from '@/assets/svg/avatar.svg';
import PlatformImage from '@/shared/platformImage';
import { COMMON } from '@/utils/common';

const imageId = 'imageId';
const width = '100px';
const height = '100px';
const method = 'scale';
const imageName = `${imageId}/r/${width}/${height}/${method}`;

jest.spyOn(console, 'warn').mockImplementation(() => {});

test('snapshot / renders without crashing', async () => {
    let tree;
    await act(() => {
        tree = create(<PlatformImage imageId={imageId} />);
    });
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders with specific width and height / renders with default "scale" method when no method is provided', async () => {
    let tree;
    await act(() => {
        tree = create(
            <PlatformImage imageId={imageId} width={width} height={height} />
        );
    });
    const image = tree.root.findByType(Image);
    expect(image.props.source.uri).toBe(
        `${COMMON.apiBaseUrl}image/${imageName}`
    );
});

test('renders with a custom method when provided', async () => {
    let tree;
    await act(() => {
        tree = create(
            <PlatformImage
                imageId={imageId}
                width={width}
                height={height}
                method={method}
            />
        );
    });
    const image = tree.root.findByType(Image);
    expect(image.props.source.uri).toBe(
        `${COMMON.apiBaseUrl}image/${imageName}`
    );
});

test('renders with a loading indicator source when provided', async () => {
    let tree;
    await act(() => {
        tree = create(
            <PlatformImage
                imageId={imageId}
                loadingIndicatorSource={loadingIndicatorSource}
            />
        );
    });
    const image = tree.root.findByType(Image);
    expect(image.props.loadingIndicatorSource).toBe(loadingIndicatorSource);
});
