import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { getFontScale } from 'react-native-device-info';

const { height: windowHeight, width: windowWidth } = Dimensions.get('window');

const useAccessibility = () => {
    // note: font scale will currently only be set once per hook-usage
    const [fontScale, setFontScale] = useState<number | null>(null);

    useEffect(() => {
        getFontScale().then((scale) => setFontScale(scale));
    }, []);

    return {
        fontScale: Number(fontScale),
        windowHeight,
        windowWidth
    };
};

export default useAccessibility;
