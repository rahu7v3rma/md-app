import React, { RefObject } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import renderer, { act } from 'react-test-renderer';

import ConfirmationDialogue from '@/shared/confirmationDialogue';

const title = 'Title One';

it('confirmationDialogue Snapshot Testing with Jest', async () => {
    const onDeleteBottomSheetRef: RefObject<RBSheet> = {
        current: null
    };
    const tree = renderer.create(
        <ConfirmationDialogue
            bottomSheetRef={onDeleteBottomSheetRef}
            title={title}
        />
    );
    expect(tree).toMatchSnapshot();
});

it('confirmationDialogue renders ConfirmationDialogue without errors', async () => {
    const onDeleteBottomSheetRef: RefObject<RBSheet> = {
        current: null
    };

    const tree = renderer.create(
        <ConfirmationDialogue
            bottomSheetRef={onDeleteBottomSheetRef}
            title={title}
        />
    );

    expect(tree).toBeTruthy();
});

it('confirmationDialogue displays subtitle when provided', async () => {
    const subTitle = 'Subtitle One';
    const onDeleteBottomSheetRef: RefObject<RBSheet> = {
        current: null
    };

    const tree = renderer.create(
        <ConfirmationDialogue
            bottomSheetRef={onDeleteBottomSheetRef}
            title={title}
            subTitle={subTitle}
        />
    );
    onDeleteBottomSheetRef.current?.open();

    const confirmationDialogueSubTitle = tree.root.findByProps({
        testID: 'confirmationDialogueSubTitle'
    }).props;
    expect(confirmationDialogueSubTitle.children).toEqual(subTitle);
});

it('confirmationDialogue calls onConfirmBtnHandler when the confirm button is clicked', async () => {
    const onConfirmBtnClick = jest.fn();
    const onDeleteBottomSheetRef: RefObject<RBSheet> = {
        current: null
    };

    const tree = renderer.create(
        <ConfirmationDialogue
            bottomSheetRef={onDeleteBottomSheetRef}
            title={title}
            onConfirmBtnHandler={onConfirmBtnClick}
        />
    );
    onDeleteBottomSheetRef.current?.open();

    const confirmBtn = tree.root.findByProps({
        testID: 'confirmBtn'
    }).props;
    await act(() => confirmBtn.onPress());
    expect(onConfirmBtnClick).toHaveBeenCalledTimes(1);
});

it('confirmationDialogue calls onRightBtnPress when the right button is pressed', async () => {
    const onDismissBtnClick = jest.fn();
    const onDeleteBottomSheetRef: RefObject<RBSheet> = {
        current: null
    };

    const tree = renderer.create(
        <ConfirmationDialogue
            bottomSheetRef={onDeleteBottomSheetRef}
            title={title}
            onDismissBtnHandler={onDismissBtnClick}
        />
    );
    onDeleteBottomSheetRef.current?.open();

    const dismissBtn = tree.root.findByProps({
        testID: 'dismissBtn'
    }).props;
    await act(() => dismissBtn.onPress());
    expect(onDismissBtnClick).toHaveBeenCalledTimes(1);
});
