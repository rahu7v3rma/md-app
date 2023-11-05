import { Dimensions } from 'react-native';

const windowHeight = Dimensions.get('window').height;

export function useSwipe(onSwipeDown?: any) {
    let firstTouchY = 0;

    // set user touch start position
    function onTouchStart(e: any) {
        firstTouchY = e.nativeEvent.pageY;
    }

    // when touch ends check for swipe directions
    function onTouchEnd(e: any) {
        // get touch position and screen size

        const positionY = e.nativeEvent.pageY;
        const rangeY = windowHeight;
        // check if position is growing positively and has reached specified range
        const diff = positionY - firstTouchY;

        if (diff > 0 && diff < rangeY) {
            onSwipeDown && onSwipeDown();
        }
    }

    return { onTouchStart, onTouchEnd };
}
