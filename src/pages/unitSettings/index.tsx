import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';

import { CrossIcon } from '@/assets/svgs';
import { RootNavigationProp } from '@/navigation';
import { Button, CustomStatusBar, Header, Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

import { unitSettingStyles } from './style';

const UnitSettings: FunctionComponent = () => {
    const navigation = useNavigation<RootNavigationProp>();
    const [selectedUnit, setSelectedUnit] = useState('metric');

    const onBackPress = () => {
        navigation.pop();
    };

    const onMetricPress = useCallback(() => {
        setSelectedUnit('metric');
    }, [setSelectedUnit]);

    const onImperialPress = useCallback(() => {
        setSelectedUnit('imperial');
    }, [setSelectedUnit]);

    return (
        <View style={unitSettingStyles.wrapper}>
            <SafeAreaView style={unitSettingStyles.continer}>
                <CustomStatusBar />
                <Header onLeftBtnPress={onBackPress} leftIcon={CrossIcon} />
                <Text
                    style={unitSettingStyles.titleText}
                    size={Size.Large}
                    fontWeight="700"
                >
                    Units
                </Text>
                <TouchableOpacity
                    style={[
                        unitSettingStyles.optionView,
                        selectedUnit === 'metric' &&
                            unitSettingStyles.selectedOption
                    ]}
                    onPress={onMetricPress}
                    testID="metric"
                >
                    <Text
                        style={unitSettingStyles.optionText}
                        size={Size.XXSmall}
                        fontWeight="600"
                    >
                        I prefer the metric system (kg, cm, mmoL)
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onImperialPress}
                    style={[
                        unitSettingStyles.optionView,
                        selectedUnit === 'imperial' &&
                            unitSettingStyles.selectedOption
                    ]}
                    testID="imperial"
                >
                    <Text
                        style={unitSettingStyles.optionText}
                        size={Size.XXSmall}
                    >
                        I prefer the imperial system (pounds, inches, mg/dL)
                    </Text>
                </TouchableOpacity>

                <Button
                    primary
                    block
                    bordered
                    style={unitSettingStyles.submitBtn}
                    onPress={() => {}}
                    testID="save"
                >
                    <Text fontWeight="700" color={Colors.text.white}>
                        Save
                    </Text>
                </Button>
            </SafeAreaView>
        </View>
    );
};

export default UnitSettings;
