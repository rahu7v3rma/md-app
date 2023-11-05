import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useState
} from 'react';
import { Image, ImageProps, ImageURISource } from 'react-native';
import RNFS from 'react-native-fs';
import { sha256 } from 'react-native-sha256';

type Props = ImageProps & {
    source: ImageURISource;
};

const getLocalUri = (remoteUri: string) => {
    // remove query string from the remote uri when creating the cached path so
    // that all images with the same path are considered the same
    let modifiedRemoteUri = remoteUri.substring(0, remoteUri.lastIndexOf('?'));
    return sha256(modifiedRemoteUri).then(
        (hashedRemoteUri) => `${RNFS.CachesDirectoryPath}/${hashedRemoteUri}`
    );
};

/**
 * This image component should *only* be used for backend-stored content
 * images, which are returned as signed S3 urls that are different every time
 * due to expiration times and url signatures.
 * The component implements a file system cache which ignores the querystring
 * part of urls when caching.
 */
const CustomCacheImage: FunctionComponent<Props> = ({
    source,
    ...props
}: Props) => {
    const [displayUri, setDisplayUri] = useState<string | undefined>(undefined);
    const [fallback, setFallback] = useState<boolean>(false);

    const handleImageChanged = useCallback(
        (localUri: string, remoteUri: string) => {
            RNFS.exists(localUri).then((exists: boolean) => {
                if (exists) {
                    setDisplayUri(`file://${localUri}`);
                } else {
                    const { promise } = RNFS.downloadFile({
                        fromUrl: remoteUri,
                        toFile: localUri
                    });

                    promise
                        .then((result) => {
                            if (result.statusCode === 200) {
                                setFallback(false);
                                setDisplayUri(`file://${localUri}`);
                            } else {
                                console.debug(
                                    'failed to load custom cached image with status',
                                    result.statusCode
                                );
                                setFallback(true);

                                // remove file to make sure we didn't cache any
                                // bad image, ignore errors
                                RNFS.unlink(localUri).catch(() => {});
                            }
                        })
                        .catch((err) => {
                            console.debug(
                                'failed to load custom cached image with error',
                                err
                            );
                            setFallback(true);

                            // remove file to make sure we didn't cache any bad
                            // image, ignore errors
                            RNFS.unlink(localUri).catch(() => {});
                        });
                }
            });
        },
        []
    );

    useEffect(() => {
        const remoteUri = source.uri;

        if (remoteUri) {
            getLocalUri(remoteUri).then((localUri) => {
                handleImageChanged(localUri, remoteUri);
            });
        } else {
            setFallback(true);
        }
    }, [source.uri, handleImageChanged]);

    return (
        <Image
            {...props}
            source={
                fallback ? source : { ...(source as object), uri: displayUri }
            }
        />
    );
};

export default CustomCacheImage;
