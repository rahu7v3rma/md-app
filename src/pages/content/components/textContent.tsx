import { useNavigation } from '@react-navigation/native';
import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useState
} from 'react';
import {
    LayoutChangeEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    TextLayoutEventData,
    TextLayoutLine,
    View
} from 'react-native';

import { Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

type Props = {
    textContent: string;
};
type ProcessedProps = {
    type: string;
    linkText: string;
    linkUrl: string;
};
const TextContent: FunctionComponent<Props> = ({ textContent }: Props) => {
    const navigation = useNavigation<RootNavigationProp>();
    const [textPagesReady, setTextPagesReady] = useState<boolean>(false);
    const [_textPages, setTextPages] = useState<string[]>([]);
    const [calculationCurrentText, setCalculationCurrentText] =
        useState<string>(textContent);
    const [calculationTextHeight, setCalculationTextHeight] = useState<
        number | null
    >(null);
    const [calculationDisplayedLines, setCalculationDisplayedLines] = useState<
        TextLayoutLine[] | null
    >(null);

    const handleOnLink = useCallback(
        (url: string) => {
            navigation.navigate('WebViewScreen', { url });
        },
        [navigation]
    );

    const onCalculationTextLayout = useCallback(
        (event: NativeSyntheticEvent<TextLayoutEventData>) => {
            setCalculationDisplayedLines(event.nativeEvent.lines);
        },
        []
    );
    const handleText = useCallback(() => {
        let processedTextArray = [];
        /* eslint-disable no-useless-escape */
        const regex = /\[([^\]]+)\]\(([^\)]+)\)/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(textContent)) !== null) {
            processedTextArray.push(textContent.slice(lastIndex, match.index));

            const linkText = match[1];
            const linkUrl = match[2];
            processedTextArray.push({ type: 'link', linkText, linkUrl });
            lastIndex = match.index + match[0].length;
        }

        processedTextArray.push(textContent.slice(lastIndex));

        return processedTextArray.map((item: ProcessedProps, index: number) => {
            if (item?.type === 'link') {
                return (
                    <Text
                        key={index}
                        style={style.linkText}
                        onPress={() => handleOnLink(item.linkUrl)}
                    >
                        {item.linkText.trim()}
                    </Text>
                );
            }
            return (
                <Text
                    key={index}
                    style={style.contentTxt}
                    onTextLayout={onCalculationTextLayout}
                    size={Size.Small}
                    color={Colors.text.gray_Base}
                    fontWeight="400"
                >
                    {item}
                </Text>
            );
        });
    }, [handleOnLink, onCalculationTextLayout, textContent]);

    const onCalculationLayout = useCallback((event: LayoutChangeEvent) => {
        setCalculationTextHeight(event.nativeEvent.layout.height);
    }, []);

    useEffect(() => {
        handleText();
    }, [textContent, handleText]);

    useEffect(() => {
        if (
            !textPagesReady &&
            calculationDisplayedLines !== null &&
            calculationTextHeight !== null
        ) {
            let currentPageText: string = '';
            const displayedText = calculationDisplayedLines
                .map((line) => line.text)
                .join('');

            for (const currLine of calculationDisplayedLines) {
                // check if this is the line that leaves the text area (minus
                // 20 for height to be sure)
                if (
                    currLine.y + currLine.height >=
                    calculationTextHeight - 20
                ) {
                    // find last index of a newline
                    let breakIndex = currentPageText.lastIndexOf('\n');

                    // if not found, find last index of a period
                    if (breakIndex === -1) {
                        breakIndex = currentPageText.lastIndexOf('.');
                    }

                    // if not found will break at end of last line
                    if (breakIndex === -1) {
                        breakIndex = currentPageText.length - 1;
                    } else {
                        // if newline or period were found make sure to include them in the current page
                        breakIndex += 1;
                    }

                    // push text page
                    setTextPages((currTextPages) => [
                        ...currTextPages,
                        currentPageText.substring(0, breakIndex).trim()
                    ]);

                    // update current text so it will be displayed and another onTextLayout will be invoked
                    setCalculationCurrentText(
                        displayedText.substring(breakIndex)
                    );

                    // stop the entire callback. we will continue when the remaining text will be rendered and onTextLayout will be invoked again
                    return;
                } else {
                    currentPageText += currLine.text;
                }
            }

            // if we got here it means the remaining text fits in a single page, so we're done
            setTextPages((currTextPages) => [
                ...currTextPages,
                displayedText.trim()
            ]);
            setTextPagesReady(true);
        }
    }, [textPagesReady, calculationDisplayedLines, calculationTextHeight]);

    return (
        <View style={style.wrapper}>
            <View style={style.contentWrapper}>
                {textPagesReady ? (
                    <>
                        <Text
                            style={style.contentTxt}
                            onTextLayout={onCalculationTextLayout}
                            size={Size.Small}
                            color={Colors.text.gray_Base}
                            fontWeight="400"
                        >
                            {handleText()}
                        </Text>
                    </>
                ) : (
                    // a scrollview with scroll disabled allows us to render
                    // the entire text while we split it into pages
                    <ScrollView
                        scrollEnabled={false}
                        onLayout={onCalculationLayout}
                    >
                        <Text
                            style={style.contentTxt}
                            onTextLayout={onCalculationTextLayout}
                            size={Size.Small}
                            color={Colors.text.gray_Base}
                            fontWeight="400"
                        >
                            {calculationCurrentText}
                        </Text>
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

export default TextContent;

const style = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'space-between'
    },
    contentWrapper: {
        flex: 1
    },
    contentTxt: {
        lineHeight: 26,
        flexDirection: 'row'
    },
    linkText: {
        color: Colors.text.link,
        textDecorationLine: 'underline'
    }
});
