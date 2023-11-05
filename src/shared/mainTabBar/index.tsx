import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs';
import { BottomTabDescriptorMap } from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import { NavigationHelpers, ParamListBase } from '@react-navigation/native';
import React, { FunctionComponent } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import home from '@/assets/svg/home.svg';
import homeActive from '@/assets/svg/homeActive.svg';
import message from '@/assets/svg/message.svg';
import messageActive from '@/assets/svg/messageActive.svg';
import todo from '@/assets/svg/todo.svg';
import todoActive from '@/assets/svg/todoActive.svg';
import PlusIcon from '@/assets/svgs/Plus';
import { ProfileImage, Text } from '@/shared';
import { Colors } from '@/theme/colors';

type Props = {
    descriptors: BottomTabDescriptorMap;
    navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
};

const _getIcon = (label: string, isFocused: boolean) => {
    switch (label) {
        case 'Main.Home':
            return (
                <View>
                    <SvgXml
                        xml={isFocused ? homeActive : home}
                        width={30}
                        height={30}
                    />
                </View>
            );
        case 'Main.Chat':
            return (
                <View>
                    <SvgXml
                        xml={isFocused ? messageActive : message}
                        width={30}
                        height={30}
                    />
                </View>
            );
        case 'Main.Journey':
            return (
                <View>
                    <SvgXml
                        xml={isFocused ? todoActive : todo}
                        width={30}
                        height={30}
                    />
                </View>
            );
        case 'Main.OpenPlus':
            return (
                <View style={styles.plusBtn}>
                    <PlusIcon />
                </View>
            );
        default:
            return (
                <View>
                    <ProfileImage
                        style={styles.profileImage}
                        height={30}
                        width={30}
                    />
                </View>
            );
    }
};

const MainTabBar: FunctionComponent<Props> = ({ descriptors, navigation }) => {
    return (
        <View style={styles.root}>
            {navigation.getState().routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                        ? options.title
                        : route.name;

                const isFocused = navigation.getState().index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key
                    });
                };

                return (
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        key={index}
                        onLongPress={onLongPress}
                        style={styles.tabButton}
                    >
                        <View
                            style={[
                                styles.tabButtonInner,
                                isFocused && styles.tabButtonInnerFocused
                            ]}
                        >
                            {_getIcon(route.name, isFocused)}
                            {route.name !== 'Main.OpenPlus' && (
                                <Text
                                    style={styles.tabButtonText}
                                    color={
                                        isFocused
                                            ? Colors.text.text_gray_black
                                            : Colors.text.gray
                                    }
                                >
                                    {typeof label === 'string'
                                        ? label
                                        : label({
                                              focused: isFocused,
                                              color: isFocused
                                                  ? 'black'
                                                  : 'rgba(0,0,0,0.6)',
                                              position: 'below-icon'
                                          })}
                                </Text>
                            )}
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        height: 100,
        paddingHorizontal: 20,
        backgroundColor: Colors.extras.white
    },
    tabButton: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    tabButtonInner: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        marginHorizontal: 'auto',
        backgroundColor: 'transparent'
    },
    tabButtonInnerFocused: {
        backgroundColor: Colors.theme.app_background_lightest
    },
    tabButtonText: {
        marginTop: 5,
        textAlign: 'center',
        fontWeight: 500
    },
    plusBtn: {
        width: 52,
        height: 52,
        borderRadius: 52 / 2,
        backgroundColor: Colors.theme.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5
    },
    profileImage: {
        height: 30,
        width: 30,
        borderRadius: 50
    }
});

export default MainTabBar;
