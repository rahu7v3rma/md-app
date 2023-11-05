import React, { FunctionComponent } from 'react';
import { Image, ImageStyle, StyleProp, TouchableOpacity } from 'react-native';

import profile from '@/assets/images/default_avatar.jpg';
import { UserSelectors } from '@/reducers/user';
import { PlatformImage } from '@/shared';

type Props = {
    style?: StyleProp<ImageStyle>;
    width?: number;
    height?: number;
    testID?: string;
    onPress?: () => void;
};

const ProfileImage: FunctionComponent<Props> = ({
    style,
    width,
    height,
    testID,
    onPress
}: Props) => {
    const { userProfile } = UserSelectors();
    return (
        <TouchableOpacity disabled={!onPress} onPress={onPress}>
            {userProfile?.image ? (
                <PlatformImage
                    style={style}
                    imageId={userProfile.image}
                    width={width}
                    height={height}
                    testID={testID}
                />
            ) : (
                <Image style={style} source={profile} />
            )}
        </TouchableOpacity>
    );
};

export default ProfileImage;
