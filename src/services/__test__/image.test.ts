import { PutObjectCommand } from '@aws-sdk/client-s3';
import { openCamera, openPicker } from 'react-native-image-crop-picker';

import imageMock from '@/pages/logMeal/__mocks__/image.json';
import { pickImage, uploadImage } from '@/services/image';

describe('pickImage', () => {
    test('should call openCamera when type is "camera"', () => {
        pickImage({ type: 'camera' });
        expect(openCamera).toBeCalled();
    });
    test('should call openPicker when type is "gallery"', () => {
        pickImage({ type: 'gallery' });
        expect(openPicker).toBeCalled();
    });
    test('should pass height, width, and cropping options when provided', () => {
        pickImage({
            type: 'gallery',
            width: 100,
            height: 100,
            cropping: false
        });
        expect(openPicker).toBeCalledWith({
            height: 100,
            width: 100,
            cropping: false,
            cropperCircleOverlay: false,
            includeBase64: true
        });
    });
});

describe('uploadImage', () => {
    const mockS3Object = {
        Bucket: 'bucketName',
        Key: 'keyPrefixfileName',
        Body: Buffer.from(imageMock.data, 'base64'),
        ContentType: imageMock.mime
    };
    test('should upload an image with publicImage set to true', async () => {
        await uploadImage(imageMock.data, imageMock.mime, 'user', true);
        expect(PutObjectCommand).toBeCalledWith(mockS3Object);
    });
    test('should upload an image with publicImage set to false', async () => {
        await uploadImage(imageMock.data, imageMock.mime, 'user', false);
        expect(PutObjectCommand).toBeCalledWith(mockS3Object);
    });
});
