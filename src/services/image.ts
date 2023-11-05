import { Buffer } from 'buffer';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { fromWebToken } from '@aws-sdk/credential-providers';
import ImagePicker from 'react-native-image-crop-picker';

// these two imports are needed for aws-sdk to work properly
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import { getImageUploadCredentials } from '@/services/api';

const pickImage = async (props: {
    type: 'camera' | 'gallery';
    height?: number;
    width?: number;
    cropping?: boolean;
}) => {
    const { type, height, width, cropping } = props;
    const imagePickerMethod =
        type === 'camera' ? ImagePicker.openCamera : ImagePicker.openPicker;
    return await imagePickerMethod({
        height: height || 200,
        width: width || 200,
        cropping,
        cropperCircleOverlay: height ? false : true,
        includeBase64: true
    });
};

const encodeImage = (
    base64Content: string,
    key: string
): Promise<Uint8Array> => {
    return new Promise((resolve) => {
        let finalKey = key;

        // while the key length is under 64 characters append the original key
        // over and over
        while (finalKey.length < 64) {
            finalKey += key;
        }

        // shorten key to be exactly 64 characters long
        if (finalKey.length > 64) {
            finalKey = finalKey.substring(0, 64);
        }

        const content = Buffer.from(base64Content, 'base64');

        /* eslint-disable no-bitwise */
        resolve(
            content.map(
                (uint, i) => uint ^ finalKey.charCodeAt(i % finalKey.length)
            )
        );
    });
};

const uploadImage = (
    base64Content: string,
    contentType: string,
    username: string,
    publicImage: boolean
): Promise<string> => {
    return Promise.all([
        getImageUploadCredentials(publicImage),
        publicImage
            ? Promise.resolve(Buffer.from(base64Content, 'base64'))
            : encodeImage(base64Content, username)
    ]).then(([uploadCredentialsResponse, encodedImage]) => {
        const imagePath =
            uploadCredentialsResponse.keyPrefix +
            uploadCredentialsResponse.fileName;

        // `mock` will only be returned when working with a mocked service.
        // the real service will never return this field
        if (uploadCredentialsResponse.mock) {
            return imagePath;
        }

        const client = new S3Client({
            region: uploadCredentialsResponse.regionName,
            credentials: fromWebToken({
                webIdentityToken: uploadCredentialsResponse.token,
                roleArn: uploadCredentialsResponse.roleArn
            })
        });

        return client
            .send(
                new PutObjectCommand({
                    Bucket: uploadCredentialsResponse.bucketName,
                    Key: imagePath,
                    Body: encodedImage,
                    ContentType: contentType
                })
            )
            .then((_putOutput) => imagePath);
    });
};

export { pickImage, uploadImage };
