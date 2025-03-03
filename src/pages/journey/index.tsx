import { useNavigation } from '@react-navigation/native';
import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';

import fox from '@/assets/images/fox.png';
import left from '@/assets/images/left.png';
import right from '@/assets/images/right.png';
import { useAppDispatch } from '@/hooks';
import { RootNavigationProp } from '@/navigation';
import { ContentSelectors, loadJourney } from '@/reducers/content';
import { CustomStatusBar, Header } from '@/shared';
import { Colors } from '@/theme/colors';
import { UserBlock } from '@/types/content';

import Block from './component/block';
import BlockPreview from './component/blockPreview';

type JourneyUserBlock = UserBlock & {
    inProgress: boolean;
    nextInProgress: boolean;
    nextComplete: boolean;
};

type Props = Record<string, never>;

const Journey: FunctionComponent<Props> = ({}: Props) => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<RootNavigationProp>();

    const { journey, activeBlock } = ContentSelectors();
    const [journeyBlocks, setJourneyBlocks] = useState<JourneyUserBlock[][]>(
        []
    );

    useEffect(() => {
        const loadedJourneyBlocks: JourneyUserBlock[][] = [];

        // sort the blocks based on order
        const sortedJourneyBlocks = [...journey];
        sortedJourneyBlocks.sort((a, b) => a.order - b.order);

        let lockedIndex = -1;

        // divide the blocks into pairs except for the first one
        for (let i = 0; i < sortedJourneyBlocks.length; i++) {
            const currentBlock = {
                ...sortedJourneyBlocks[i]
            } as JourneyUserBlock;

            if (currentBlock.block.locked) {
                lockedIndex = i;
            }

            if (lockedIndex !== -1 && lockedIndex <= i) {
                currentBlock.block.locked = true;
                currentBlock.inProgress = false;
            } else {
                currentBlock.inProgress =
                    currentBlock.block.name === activeBlock?.block.name;

                // precalculate whether the next block is in progress or complete
                // for connector colors
                if (i < sortedJourneyBlocks.length - 1) {
                    currentBlock.nextInProgress =
                        sortedJourneyBlocks[i + 1] === activeBlock;
                    currentBlock.nextComplete =
                        sortedJourneyBlocks[i + 1].is_completed;
                }
            }

            if (i === 0) {
                // the first block always appears alone in its row
                loadedJourneyBlocks.push([currentBlock]);

                // start the next row now to make sure the first one isn't pushed to
                if (sortedJourneyBlocks.length > 1) {
                    loadedJourneyBlocks.push([]);
                }
            } else {
                // if the current last row is full start a new one, otherwise append to it
                if (
                    loadedJourneyBlocks[loadedJourneyBlocks.length - 1]
                        .length >= 2
                ) {
                    loadedJourneyBlocks.push([currentBlock]);
                } else {
                    loadedJourneyBlocks[loadedJourneyBlocks.length - 1].push(
                        currentBlock
                    );
                }
            }
        }

        // reverse the block rows since the scrollview is built top-to-bottom
        // while the blocks should be ordered bottom-to-top
        loadedJourneyBlocks.reverse();

        setJourneyBlocks(loadedJourneyBlocks);
    }, [journey, activeBlock]);

    const scrollViewRef = useRef<ScrollView>(null);

    const [modalUserBlock, setModalUserBlock] = useState<UserBlock | null>(
        null
    );

    useEffect(() => {
        dispatch(loadJourney({}));
    }, [dispatch]);

    const handleBlockPressed = useCallback(
        (userBlock: JourneyUserBlock) => {
            if (userBlock.inProgress || userBlock.is_completed) {
                navigation.navigate('Block', {
                    data: userBlock
                });
            } else {
                setModalUserBlock(userBlock);
            }
        },
        [navigation]
    );

    const handleModalDismiss = () => {
        setModalUserBlock(null);
    };

    return (
        <SafeAreaView style={styles.root}>
            <Header title="My Journey" styles={styles.header} />
            <CustomStatusBar />
            <View style={styles.container}>
                <View style={styles.leftImg}>
                    <Image source={left} resizeMode="contain" />
                </View>
                <View style={styles.rightImg}>
                    <Image source={right} resizeMode="contain" />
                </View>
                <View style={styles.centerContent}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollViewContent}
                        ref={scrollViewRef}
                        onContentSizeChange={() =>
                            scrollViewRef.current?.scrollToEnd({
                                animated: false
                            })
                        }
                    >
                        {journeyBlocks.map((row, rowIndex) => (
                            <View key={`journey-row-${rowIndex}`}>
                                <View
                                    style={[
                                        styles.blocksRow,
                                        // reverse every other row to maintain snake-like structure
                                        rowIndex % 2 !==
                                            journeyBlocks.length % 2 &&
                                            rowIndex <
                                                journeyBlocks.length - 1 &&
                                            styles.blocksRowReversed
                                    ]}
                                >
                                    {/* final row connector - the only one that bends upwards (if there are more rows and if the next row has more than one block) */}
                                    {rowIndex === journeyBlocks.length - 1 &&
                                        rowIndex > 0 &&
                                        journeyBlocks[rowIndex - 1].length >
                                            1 && (
                                            <View
                                                style={[
                                                    styles.doubleToSingleConnector,
                                                    row[0].nextInProgress &&
                                                        styles.connectorInProgress,
                                                    row[0].nextComplete &&
                                                        styles.connectorComplete
                                                ]}
                                            />
                                        )}
                                    <Block
                                        testID={`block${rowIndex}`}
                                        img={row[0].block.icon}
                                        progress={row[0].inProgress}
                                        complete={row[0].is_completed}
                                        onPress={() => {
                                            handleBlockPressed(row[0]);
                                        }}
                                    />

                                    {row.length > 1 && (
                                        <>
                                            {/* mid-row horizontal connector for rows with two blocks */}
                                            <View
                                                style={[
                                                    styles.inRowBlocksConnector,
                                                    row[1].inProgress &&
                                                        styles.connectorInProgress,
                                                    row[1].is_completed &&
                                                        styles.connectorComplete
                                                ]}
                                            />

                                            <Block
                                                testID={'lockedBlock'}
                                                img={row[1].block.icon}
                                                progress={row[1].inProgress}
                                                complete={row[1].is_completed}
                                                onPress={() => {
                                                    handleBlockPressed(row[1]);
                                                }}
                                            />
                                        </>
                                    )}
                                </View>

                                {/*
                                 * inter-row base connector which is just a straight lines. for double-to-double rows this
                                 * is the only connector needed. for single-to-double we will add a curved connector next
                                 */}
                                {rowIndex < journeyBlocks.length - 1 && (
                                    <View
                                        style={[
                                            styles.verticalConnectorLeft,
                                            rowIndex % 2 !==
                                                journeyBlocks.length % 2 &&
                                                styles.verticalConnectorRight,
                                            // when this is the before-last row and it contains just one block (as does
                                            // the last row) the vertical connection needs to be centered
                                            row.length === 1 &&
                                                journeyBlocks.length - 1 ===
                                                    rowIndex + 1 &&
                                                styles.verticalConnectorCenter,
                                            row[0].inProgress &&
                                                styles.connectorInProgress,
                                            row[0].is_completed &&
                                                styles.connectorComplete
                                        ]}
                                    />
                                )}

                                {/* curved connector which continues the vertical one */}
                                {row.length === 1 &&
                                    rowIndex < journeyBlocks.length - 2 && (
                                        <View
                                            style={[
                                                styles.singleToDoubleConnectorLeft,
                                                rowIndex % 2 !==
                                                    journeyBlocks.length % 2 &&
                                                    styles.singleToDoubleConnectorRight,
                                                row[0].inProgress &&
                                                    styles.connectorInProgress,
                                                row[0].is_completed &&
                                                    styles.connectorComplete
                                            ]}
                                        />
                                    )}
                            </View>
                        ))}
                        <View style={styles.foxImageContainer}>
                            <Image source={fox} />
                        </View>
                    </ScrollView>
                </View>
            </View>

            {/* block preview modal window */}
            <BlockPreview
                testID="lockBlockModal"
                onDismiss={handleModalDismiss}
                visible={modalUserBlock !== null}
                blockLevel={modalUserBlock?.order || 0}
                title={modalUserBlock?.block.name || ''}
                description={modalUserBlock?.block.description || ''}
                img={modalUserBlock?.block.icon || ''}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.extras.white
    },
    header: {
        height: 80
    },
    container: {
        flex: 1,
        backgroundColor: Colors.extras.page_bg
    },
    leftImg: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '20%',
        height: '100%'
    },
    rightImg: {
        position: 'absolute',
        top: 0,
        right: -6,
        width: '20%',
        height: '100%'
    },
    centerContent: {
        alignItems: 'center',
        flex: 1
    },
    scrollView: {
        width: '65%'
    },
    scrollViewContent: {
        justifyContent: 'flex-end',
        minHeight: '100%',
        paddingTop: 20
    },
    blocksRow: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    blocksRowReversed: {
        flexDirection: 'row-reverse'
    },
    doubleToSingleConnector: {
        height: 76,
        width: '20%',
        borderColor: Colors.extras.block_locked,
        borderLeftWidth: 8,
        borderBottomLeftRadius: 20,
        borderBottomWidth: 8,
        position: 'absolute',
        left: '20%',
        top: '-15%',
        zIndex: -999
    },
    inRowBlocksConnector: {
        top: '20%',
        width: '20%',
        height: 0,
        borderTopWidth: 8,
        borderColor: Colors.extras.block_locked,
        zIndex: -999,
        marginHorizontal: '-2%'
    },
    verticalConnectorLeft: {
        height: 28,
        width: 0,
        borderLeftWidth: 8,
        borderColor: Colors.extras.block_locked,
        marginLeft: '20%',
        marginVertical: '-1%',
        zIndex: -999
    },
    verticalConnectorRight: {
        marginLeft: '78%'
    },
    verticalConnectorCenter: {
        marginLeft: '48%'
    },
    singleToDoubleConnectorLeft: {
        height: 76,
        width: '20%',
        borderColor: Colors.extras.block_locked,
        borderLeftWidth: 8,
        borderTopLeftRadius: 20,
        borderTopWidth: 8,
        position: 'absolute',
        left: '20%',
        top: '40%',
        zIndex: -999
    },
    singleToDoubleConnectorRight: {
        transform: [{ rotateY: '180deg' }],
        left: '61%'
    },
    connectorInProgress: {
        borderColor: Colors.extras.block_in_progress
    },
    connectorComplete: {
        borderColor: Colors.extras.block_complete
    },
    foxImageContainer: {
        alignItems: 'center',
        marginTop: 20
    }
});

export default Journey;
