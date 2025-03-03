import React from 'react';
import renderer from 'react-test-renderer';

import ProgressCircle from '@/shared/progressCircle';

function percentToDegrees(percent: number): number {
    return percent * 3.6;
}

it('progressCircle Snapshot Testing with Jest', async () => {
    const tree = renderer.create(<ProgressCircle radius={15} percent={0} />);
    expect(tree).toMatchSnapshot();
});

it('progressCircle should render without errors', async () => {
    const tree = renderer.create(<ProgressCircle radius={15} percent={0} />);
    expect(tree.root).toBeTruthy();
});

it('progressCircle should display the initial percent correctly', async () => {
    const circleRotateTransformTest = async (percent: number) => {
        const normalizedPercent = Math.max(Math.min(100, percent), 0);

        let halfCircle1Degree;
        let halfCircle2Degree;
        const needHalfCircle2 = normalizedPercent > 50;
        const circleDegree = percentToDegrees(normalizedPercent);

        // degrees indicate the 'end' of the half circle, i.e. they span (degree - 180, degree)
        if (needHalfCircle2) {
            halfCircle1Degree = 180;
            halfCircle2Degree = percentToDegrees(normalizedPercent);
        } else {
            halfCircle1Degree = percentToDegrees(normalizedPercent);
            halfCircle2Degree = 0;
        }

        const tree = renderer.create(
            <ProgressCircle radius={15} percent={percent} />
        );

        // check rotate transform of internalCircleWrapper
        const internalCircleDegree = tree.root.findByProps({
            testID: 'internalCircleWrapper'
        }).props;
        expect(internalCircleDegree.style[2].transform[0].rotate).toBe(
            `${circleDegree}deg`
        );

        // check rotate transform of firstHalfCircle
        const firstHalfCircle = tree.root.findByProps({
            testID: 'firstHalfCircle'
        }).props;
        expect(firstHalfCircle.style[1].transform[1].rotate).toBe(
            `${halfCircle1Degree}deg`
        );

        // check rotate transform of secondHalfCircle
        const secondHalfCircle = tree.root.findByProps({
            testID: 'secondHalfCircle'
        }).props;
        expect(secondHalfCircle.style[1].transform[1].rotate).toBe(
            `${halfCircle2Degree}deg`
        );
    };
    await circleRotateTransformTest(0);
    await circleRotateTransformTest(90);
});

it('progressCircle should apply the color prop correctly', async () => {
    const color = '#f00';
    const currentShadowColor = '#000';

    const colorPropBasedOnPercentTest = async (percent: number) => {
        const normalizedPercent = Math.max(Math.min(100, percent), 0);
        const needHalfCircle2 = normalizedPercent > 50;

        const tree = renderer.create(
            <ProgressCircle
                radius={15}
                percent={percent}
                color={color}
                shadowColor={currentShadowColor}
            />
        );

        // check color of inner circle
        const internalCircleBackground = tree.root.findByProps({
            testID: 'internalCircleBackground'
        }).props;
        expect(internalCircleBackground.style[1].backgroundColor).toBe(color);

        // check color of firstHalfCircle
        const firstHalfCircle = tree.root.findByProps({
            testID: 'firstHalfCircle'
        }).props;
        expect(firstHalfCircle.style[1].backgroundColor).toBe(color);

        // check color of secondHalfCircle
        const secondHalfCircle = tree.root.findByProps({
            testID: 'secondHalfCircle'
        }).props;
        expect(secondHalfCircle.style[1].backgroundColor).toBe(color);
        expect(secondHalfCircle.style[3].backgroundColor).toBe(
            needHalfCircle2 ? color : currentShadowColor
        );
    };

    await colorPropBasedOnPercentTest(0);
    await colorPropBasedOnPercentTest(55);
});

it('progressCircle should apply the borderWidth prop correctly', async () => {
    const borderWidth = 5;
    const radius = 15;

    const tree = renderer.create(
        <ProgressCircle
            radius={radius}
            percent={55}
            borderWidth={borderWidth}
        />
    );

    // check dimensions of internalCircleBackground View
    const internalCircleBackground = tree.root.findByProps({
        testID: 'internalCircleBackground'
    }).props;
    expect(internalCircleBackground.style[1].height).toBe(borderWidth);
    expect(internalCircleBackground.style[1].width).toBe(borderWidth);
    expect(internalCircleBackground.style[1].borderRadius).toBe(borderWidth);

    // check dimensions of internalCircle View
    const internalCircle = tree.root.findByProps({
        testID: 'internalCircle'
    }).props;
    expect(internalCircle.style[1].height).toBe(borderWidth - 4);
    expect(internalCircle.style[1].width).toBe(borderWidth - 4);
    expect(internalCircle.style[1].borderRadius).toBe(borderWidth);

    // check dimensions of innerCircleContainer View
    const radiusMinusBorder = radius - borderWidth;
    const innerCircleContainer = tree.root.findByProps({
        testID: 'innerCircleContainer'
    }).props;
    expect(innerCircleContainer.style[1].width).toBe(radiusMinusBorder * 2);
    expect(innerCircleContainer.style[1].height).toBe(radiusMinusBorder * 2);
    expect(innerCircleContainer.style[1].borderRadius).toBe(radiusMinusBorder);

    // check dimensions of internalCircleContainer View
    const internalCircleContainer = tree.root.findByProps({
        testID: 'internalCircleContainer'
    }).props;
    expect(internalCircleContainer.style[1].height).toBe(borderWidth);
    expect(internalCircleContainer.style[1].width).toBe(borderWidth);
    expect(internalCircleContainer.style[1].borderRadius).toBe(borderWidth);
});

it('progressCircle should apply the bgColor prop correctly', async () => {
    const bgColor = '#f00';
    const tree = renderer.create(
        <ProgressCircle radius={15} percent={55} bgColor={bgColor} />
    );

    const innerCircleContainer = tree.root.findByProps({
        testID: 'innerCircleContainer'
    }).props;
    expect(innerCircleContainer.style[1].backgroundColor).toBe(bgColor);
});
