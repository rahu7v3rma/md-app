import React from 'react';
import { StyleSheet } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import LessonCard from '@/shared/lessonCard';
import { Colors } from '@/theme/colors';
import { LayoutContants } from '@/theme/layoutContants';

jest.mock('react-native-modal', () => 'react-native-modal');

const lessonCardStyle = StyleSheet.create({
    card: {
        width: '100%',
        height: LayoutContants.cardHeight,
        borderColor: Colors.button.app_button_disabled_bg,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: Colors.extras.white,
        elevation: 1,
        shadowOpacity: 0.06,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 0 },
        shadowColor: Colors.theme.app_sheet_background_color
    },
    cardComplete: {},
    cardInProgress: {
        backgroundColor: Colors.extras.card_inProgress
    }
});

it('lessonCard snapshot', async () => {
    const tree = renderer.create(<LessonCard />);
    expect(tree).toMatchSnapshot();
});

it('lessonCard renders without crashing', async () => {
    const tree = renderer.create(<LessonCard />);
    expect(tree.root).toBeTruthy();
});

it('displays progress animation when progress is true', async () => {
    const tree = renderer.create(
        <LessonCard cardContainerID={'cardContainerID'} progress={true} />
    );
    let cardContainerID = tree.root.findByProps({
        testID: 'cardContainerID'
    }).props;
    expect(cardContainerID.style).toStrictEqual([
        lessonCardStyle.card,
        undefined,
        lessonCardStyle.cardInProgress,
        {
            transform: expect.anything()
        },
        undefined
    ]);
});

it('displays completion animation when complete is true', async () => {
    const tree = renderer.create(
        <LessonCard cardContainerID={'cardContainerID'} complete={true} />
    );
    let cardContainerID = tree.root.findByProps({
        testID: 'cardContainerID'
    }).props;
    expect(cardContainerID.style).toStrictEqual([
        lessonCardStyle.card,
        lessonCardStyle.cardComplete,
        undefined,
        {
            transform: expect.anything()
        },
        undefined
    ]);
});

it('calls onPress when the card is pressed', async () => {
    const onPress = jest.fn();
    const tree = renderer.create(
        <LessonCard
            cardTouchViewID={'cardTouchViewID'}
            complete={true}
            onPress={onPress}
        />
    );
    let cardTouchViewID = tree.root.findByProps({
        testID: 'cardTouchViewID'
    }).props;
    await act(() => cardTouchViewID.onPress());
    expect(onPress).toHaveBeenCalledTimes(1);
});

it('calls onCompleted with true when the card is completed', async () => {
    const onCompleted = jest.fn();
    await act(async () => {
        renderer.create(
            <LessonCard
                cardTouchViewID={'cardTouchViewID'}
                complete={true}
                onCompleted={onCompleted}
                shouldAnimate={false}
            />
        );
    });
    expect(onCompleted).toHaveBeenCalledTimes(1);
});
