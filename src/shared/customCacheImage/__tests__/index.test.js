import React from 'react';
import { Image } from 'react-native';
import { act, create } from 'react-test-renderer';

import {
    mockRNFSCachesDirectoryPath,
    mockRNFSDownloadFile,
    mockRNFSExists,
    mockRNSha256
} from '@/jestSetup';
import CustomCacheImage from '@/shared/customCacheImage';

const mockPropUri = 'mockPropUri';
const mockHashedLocalUri = 'mockHashedLocalUri';
const mockLocalUri = `${mockRNFSCachesDirectoryPath}/${mockHashedLocalUri}`;
const mockDownloadedRemoteUri = mockLocalUri;
mockRNSha256.mockResolvedValue(mockHashedLocalUri);

test('snapshot / renders without errors', async () => {
    let tree;
    await act(() => {
        tree = create(<CustomCacheImage source={{}} />);
    });
    expect(tree.toJSON()).toMatchSnapshot();
});

test('displays a fallback image when source URI is not provided', async () => {
    let tree;
    await act(() => {
        tree = create(<CustomCacheImage source={{}} />);
    });
    const image = tree.root.findByType(Image);
    expect(image.props.source).toMatchObject({});
});

test('displays the image with the correct URI - local', async () => {
    mockRNFSExists.mockImplementation(() => Promise.resolve(true));
    let tree;
    await act(() => {
        tree = create(<CustomCacheImage source={{ uri: mockPropUri }} />);
    });
    const image = tree.root.findByType(Image);
    expect(image.props.source.uri).toBe(`file://${mockLocalUri}`);
});

test('displays the image with the correct URI - remote status 200', async () => {
    mockRNFSExists.mockImplementation(() => Promise.resolve(false));
    mockRNFSDownloadFile.mockImplementation(() => ({
        promise: Promise.resolve({ statusCode: 200 })
    }));
    let tree;
    await act(() => {
        tree = create(<CustomCacheImage source={{ uri: mockPropUri }} />);
    });
    const image = tree.root.findByType(Image);
    expect(image.props.source.uri).toBe(`file://${mockDownloadedRemoteUri}`);
});

test('falls back to original source when there is an error - remote status not 200', async () => {
    mockRNFSExists.mockImplementation(() => Promise.resolve(false));
    mockRNFSDownloadFile.mockImplementation(() => ({
        promise: Promise.resolve({ statusCode: 500 })
    }));
    let tree;
    await act(() => {
        tree = create(<CustomCacheImage source={{ uri: mockPropUri }} />);
    });
    const image = tree.root.findByType(Image);
    expect(image.props.source.uri).toBe(mockPropUri);
});

test('falls back to original source when there is an error - rnfs download file', async () => {
    mockRNFSExists.mockImplementation(() => Promise.resolve(false));
    mockRNFSDownloadFile.mockImplementation(() => ({
        promise: Promise.reject()
    }));
    let tree;
    await act(() => {
        tree = create(<CustomCacheImage source={{ uri: mockPropUri }} />);
    });
    const image = tree.root.findByType(Image);
    expect(image.props.source.uri).toBe(mockPropUri);
});
