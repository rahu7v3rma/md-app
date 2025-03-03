import React from 'react';
import renderer, { act } from 'react-test-renderer';

import ChatAvatar from '@/shared/chatAvatar';

let tree;
beforeEach(async () => {
    tree = await act(() => renderer.create(<ChatAvatar />));
});

describe('test chatAvatar', () => {
    it('snapshot test', async () => {
        expect(tree).toMatchSnapshot();
    });

    it('renders with default values', async () => {
        expect(tree.root).toBeTruthy();
    });

    it('renders with a provided image path', async () => {
        await act(() => tree.update(<ChatAvatar path="1234" />));
        expect(tree.root.findByProps({ imageId: '1234' })).toBeTruthy();
    });

    it('displays online dot when online prop is true', async () => {
        await act(() => tree.update(<ChatAvatar online={true} />));
        expect(tree.root.findByProps({ testID: 'online' })).toBeTruthy();
    });

    it('correctly applies width and height styles first case', async () => {
        await act(() => tree.update(<ChatAvatar width={16} height={16} />));
        expect([
            tree.root.findByType('Image').props.style.width,
            tree.root.findByType('Image').props.style.height
        ]).toEqual([16, 16]);
    });

    it('correctly applies width and height styles second case', async () => {
        await act(() =>
            tree.update(<ChatAvatar path="1234" width={16} height={16} />)
        );
        expect([
            tree.root.findByProps({ imageId: '1234' }).props.width,
            tree.root.findByProps({ imageId: '1234' }).props.height
        ]).toEqual([16, 16]);
    });
});
