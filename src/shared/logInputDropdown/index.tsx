// const dropdownData = [
//     {
//         title: 'Soccer',
//         value: 1
//     },
//     {
//         title: 'Swimming',
//         value: 2
//     },
//     {
//         title: 'Cycling',
//         value: 3
//     },
// ];

/*
<LogInputDropdown
    fieldName="Select Activity"
    selectedValue={3}
    labelKey="title"
    valueKey="value"
    onSelect={(data) => {
        console.log("Selected value ", data.value);
    }}
    options={dropdownData}
/>
*/

import React, { FunctionComponent, useMemo, useRef } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import { CheckIcon, ChevronDown } from '@/assets/svgs';
import { Text } from '@/shared';
import { Colors } from '@/theme/colors';

import LogInput from '../logInput';

type Props = {
    options: Array<any>;
    fieldName: string;
    selectedValue: any;
    labelKey: string;
    valueKey: string;
    style?: StyleProp<ViewStyle>;
    onSelect?: (data: any) => void;
    onOpen?: () => void | null;
    onClose?: () => void | null;
    onPressInput?: () => void;
    disabled?: boolean;
};

const dropdownItemHeight = 64;

const LogInputDropdown: FunctionComponent<Props> = ({
    fieldName,
    options,
    selectedValue,
    labelKey,
    valueKey,
    onSelect,
    onOpen,
    onClose,
    onPressInput,
    disabled
}: Props) => {
    const selectedOption =
        options?.length > 0 && selectedValue
            ? options?.find((option) => option[valueKey] === selectedValue)[
                  labelKey
              ]
            : null;
    const refRBSheet = useRef<RBSheet>(null);

    const scrollHeight = useMemo(() => {
        const scrollContentHeight = (options?.length + 1) * dropdownItemHeight;
        const scrollMaxHeight = Dimensions.get('window').height / 2;
        return scrollContentHeight > scrollMaxHeight
            ? scrollMaxHeight
            : scrollContentHeight;
    }, [options.length]);

    return (
        <>
            <LogInput
                fieldName={fieldName}
                value={selectedOption}
                rightIcon={ChevronDown}
                onPress={
                    disabled
                        ? () => {}
                        : () => {
                              onPressInput && onPressInput();
                              refRBSheet.current?.open();
                          }
                }
            />

            <View style={styles.container}>
                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    height={scrollHeight}
                    customStyles={{
                        wrapper: styles.wrapper,
                        container: styles.contentContainer,
                        draggableIcon: styles.draggableIcon
                    }}
                    onOpen={onOpen}
                    onClose={onClose}
                >
                    <ScrollView
                        scrollEnabled
                        contentContainerStyle={styles.modalContainerView}
                        style={[
                            styles.modalView,
                            {
                                maxHeight: scrollHeight
                            }
                        ]}
                    >
                        {options.map((option, key) => {
                            const isSelected =
                                option[valueKey] === selectedValue;
                            return (
                                <TouchableOpacity
                                    key={key}
                                    testID={`choice${option.id}`}
                                    style={[
                                        styles.dropDownItem,
                                        key === 0 && styles.dropDownLastItem
                                    ]}
                                    onPress={() => {
                                        onSelect && onSelect(option);
                                        refRBSheet.current?.close();
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.title,
                                            isSelected && styles.activeTitle
                                        ]}
                                    >
                                        {option[labelKey]}
                                    </Text>
                                    {isSelected && (
                                        <View
                                            style={styles.tickIcon}
                                            testID={`icon${option.id}`}
                                        >
                                            <CheckIcon
                                                width={14}
                                                height={14}
                                                color={Colors.extras.white}
                                            />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </RBSheet>
            </View>
        </>
    );
};

export default LogInputDropdown;

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: Colors.theme.app_sheet_background_color
    },
    draggableIcon: {
        width: 60
    },
    contentContainer: {
        alignItems: 'center',
        opacity: 1,
        backgroundColor: 'white',
        marginHorizontal: 12,
        width: '94%',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainerView: {
        paddingBottom: 100
    },
    modalView: {
        backgroundColor: Colors.text.white,
        marginHorizontal: 8,
        width: '94%',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16
    },
    dropDownItem: {
        height: dropdownItemHeight,
        alignItems: 'center',
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: Colors.modals.divider
    },
    dropDownLastItem: {
        borderTopWidth: 0
    },
    title: {
        color: Colors.text.black,
        fontSize: 16,
        flex: 1,
        fontWeight: '600'
    },
    activeTitle: {
        color: Colors.theme.primary
    },
    tickIcon: {
        width: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.theme.primary,
        borderRadius: 8,
        marginRight: 5
    }
});
