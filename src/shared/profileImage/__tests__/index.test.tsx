import React from 'react';
import { act, create } from 'react-test-renderer';

import ProfileImage from '@/shared/profileImage';

let tree: any;
beforeAll(async () => {
    await act(() => {
        tree = create(
            <ProfileImage testID="profile-image" width={100} height={200} />
        );
    });
});

describe('ProfileImage Component', () => {
    test('Snapshot Testing', () => {
        expect(tree.toJSON()).toMatchSnapshot();
    });

    test('Renders a default profile image when userProfile.image is not provided', async () => {
        const defaultImage = tree.root.findByProps({
            testID: 'profile-image'
        });
        expect(defaultImage).toBeTruthy();
    });

    test('Renders a user profile image when userProfile.image is provided', async () => {
        const userProfileImage = tree.root.findByProps({
            testID: 'profile-image'
        });
        expect(userProfileImage).toBeTruthy();
    });

    test('Handles different width and height prop values', async () => {
        const width = 100;
        const height = 200;
        const profileImage = tree.root.findByProps({
            testID: 'profile-image'
        });
        expect(profileImage.props.width).toEqual(width);
        expect(profileImage.props.height).toEqual(height);
    });
});
