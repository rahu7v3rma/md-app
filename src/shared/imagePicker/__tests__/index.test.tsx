import React from 'react';
import renderer, { act } from 'react-test-renderer';

import imageMock from '@/pages/logMeal/__mocks__/image.json';
import * as imageServices from '@/services/image';
import ImagePicker from '@/shared/imagePicker';

jest.spyOn(imageServices, 'pickImage').mockResolvedValue(imageMock);

it('imagePicker snapshot', async () => {
    const tree = renderer.create(<ImagePicker onImagePicked={() => {}} />);
    expect(tree).toMatchSnapshot();
});

it('imagePicker renders without errors', async () => {
    const tree = renderer.create(<ImagePicker onImagePicked={() => {}} />);
    expect(tree.root).toBeTruthy();
});

it('opens the image chooser when the image is pressed', async () => {
    const tree = renderer.create(
        <ImagePicker
            onImagePicked={() => {}}
            imageChooserTouchID={'imageChooserTouchID'}
        />
    );
    let imageChooserTouchID = tree.root.findByProps({
        testID: 'imageChooserTouchID'
    }).props;
    await act(() => imageChooserTouchID.onPress());
    let choosePhoto = tree.root.findByProps({
        testID: 'choosePhoto'
    }).props;
    expect(choosePhoto).toBeTruthy();
});

it('calls onImagePicked when an image is selected', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    const onImagePicked = jest.fn();
    const tree = renderer.create(
        <ImagePicker
            onImagePicked={onImagePicked}
            imageChooserTouchID={'imageChooserTouchID'}
        />
    );
    let imageChooserTouchID = tree.root.findByProps({
        testID: 'imageChooserTouchID'
    }).props;
    await act(() => imageChooserTouchID.onPress());
    let choosePhoto = tree.root.findByProps({
        testID: 'choosePhoto'
    }).props;
    await act(() => choosePhoto.onPress());
    expect(onImagePicked).toHaveBeenCalledTimes(1);
});

it('clears the selected image when delete button is pressed', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    const onImagePicked = jest.fn();
    const tree = renderer.create(
        <ImagePicker
            onImagePicked={onImagePicked}
            imageChooserTouchID={'imageChooserTouchID'}
            deleteImageID={'deleteImageID'}
        />
    );
    let imageChooserTouchID = tree.root.findByProps({
        testID: 'imageChooserTouchID'
    }).props;
    await act(() => imageChooserTouchID.onPress());
    let choosePhoto = tree.root.findByProps({
        testID: 'choosePhoto'
    }).props;
    await act(() => choosePhoto.onPress());
    expect(onImagePicked).toHaveBeenCalledTimes(1);
    let deleteImageID = tree.root.findByProps({
        testID: 'deleteImageID'
    }).props;
    await act(() => deleteImageID.onPress());
    let imagePickerButton = tree.root.findByProps({
        testID: 'imagePickerButton'
    }).props;
    expect(imagePickerButton).toBeTruthy();
});
