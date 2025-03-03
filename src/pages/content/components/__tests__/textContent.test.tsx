import React from 'react';
import { ScrollView, Text } from 'react-native';
import { act, create, ReactTestRenderer } from 'react-test-renderer';

import { mockNavigate } from '@/jestSetup';
import TextContent from '@/pages/content/components/textContent';

describe('single line', () => {
    const textContent = 'Click [here](https://www.google.com/)';
    const onScrollViewLayout = { nativeEvent: { layout: { height: 52 } } };
    const onTextLayout =
        '{"nativeEvent":{"lines":[{"ascender":18.909090042114258,"baseline":18.909090042114258,"capHeight":13.069090843200684,"descender":7.2727274894714355,"height":26.18181800842285,"text":"Click here","width":89.09091186523438,"x":0,"xHeight":9.661818504333496,"y":0}]}}';
    let tree!: ReactTestRenderer;
    act(() => {
        tree = create(<TextContent textContent={textContent} />);
    });
    act(() => {
        tree.root.findByType(ScrollView).props.onLayout(onScrollViewLayout);
        tree.root.findByType(Text).props.onTextLayout(JSON.parse(onTextLayout));
    });
    const allText = tree.root.findByType(Text).props.children;
    test('should render text content with a link', () => {
        expect(allText[0].props.children).toBe('Click ');
        expect(allText[1].props.children).toBe('here');
    });
    test('should navigate to the web view when clicking a link', () => {
        act(() => allText[1].props.onPress());
        expect(mockNavigate).toBeCalledWith('WebViewScreen', {
            url: 'https://www.google.com/'
        });
    });
});

test('multiple lines - should render text content', () => {
    const textContent =
        'Lorem ipsum dolor sit amet. Please check [this](https://www.google.com/)';
    const onScrollViewLayout = { nativeEvent: { layout: { height: 79 } } };
    const onTextLayout =
        '{"nativeEvent":{"lines":[{"ascender":18.909090042114258,"baseline":18.909090042114258,"capHeight":13.069090843200684,"descender":6.545454502105713,"height":25.454545974731445,"text":"Lorem ipsum dolor sit amet. Please ","width":321.4545593261719,"x":0,"xHeight":9.661818504333496,"y":0},{"ascender":18.909090042114258,"baseline":44.3636360168457,"capHeight":13.069090843200684,"descender":7.2727274894714355,"height":26.18181800842285,"text":"check this","width":90.90908813476562,"x":0,"xHeight":9.661818504333496,"y":25.454545974731445}]}}';
    let tree!: ReactTestRenderer;
    act(() => {
        tree = create(<TextContent textContent={textContent} />);
    });
    act(() => {
        tree.root.findByType(ScrollView).props.onLayout(onScrollViewLayout);
        tree.root.findByType(Text).props.onTextLayout(JSON.parse(onTextLayout));
    });
    const allText = tree.root.findByType(Text).props.children;
    expect(allText[0].props.children).toBe(
        'Lorem ipsum dolor sit amet. Please check '
    );
    expect(allText[1].props.children).toBe('this');
});
