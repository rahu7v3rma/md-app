import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { Image, ImageStyle, ImageURISource, StyleProp } from 'react-native';

import {
    AUTHORIZATION_HEADER_NAME,
    getAuthorizationHeaderValue
} from '@/utils/auth';
import { COMMON } from '@/utils/common';

// only scale is supported for now
type SupportedResizeMethod = 'scale';

type Props = {
    imageId: string;
    testID?: string;
    width?: number;
    height?: number;
    method?: SupportedResizeMethod;
    style?: StyleProp<ImageStyle>;
    loadingIndicatorSource?: ImageURISource;
};

const PlatformImage: FunctionComponent<Props> = ({
    imageId,
    width,
    height,
    method = 'scale',
    style,
    testID,
    loadingIndicatorSource
}: Props) => {
    const [authorizationHeader, setAuthorizationHeader] = useState<
        string | undefined
    >(undefined);

    useEffect(() => {
        getAuthorizationHeaderValue().then((header) =>
            setAuthorizationHeader(header)
        );
    }, []);

    const imageName = useMemo(() => {
        if (width && height) {
            return `${imageId}/r/${width}/${height}/${method}`;
        } else {
            return imageId;
        }
    }, [imageId, width, height, method]);

    return (
        <Image
            testID={testID}
            style={style}
            resizeMode="contain"
            source={
                authorizationHeader
                    ? {
                          uri: `${COMMON.apiBaseUrl}image/${imageName}`,
                          headers: {
                              [AUTHORIZATION_HEADER_NAME]: authorizationHeader
                          }
                      }
                    : {}
            }
            loadingIndicatorSource={loadingIndicatorSource}
        />
    );
};

export default PlatformImage;
