import { useCallback, useEffect, useState } from 'react';

const useCurrentDate = () => {
    const [currentDate, setCurrentDate] = useState<Date>();

    const updateCurrentDate = useCallback(() => {
        setCurrentDate(new Date());
    }, []);

    const scheduleCurrentDateUpdate = useCallback(() => {
        const d = new Date();
        const secondsToEndOfDay =
            24 * 60 * 60 -
            d.getHours() * 60 * 60 -
            d.getMinutes() * 60 -
            d.getSeconds();

        // schedule a date update one second after the end of this day
        return setTimeout(() => {
            updateCurrentDate();
        }, (secondsToEndOfDay + 1) * 1000);
    }, [updateCurrentDate]);

    useEffect(() => {
        updateCurrentDate();

        let timeoutRef = scheduleCurrentDateUpdate();

        // reschedule the timeout every hour so even if the app is running
        // as the date changes we will update the next time the date changes
        // as well
        const rescheduleInterval = setInterval(() => {
            if (timeoutRef) {
                clearTimeout(timeoutRef);
            }

            timeoutRef = scheduleCurrentDateUpdate();
        }, 60 * 60 * 1000);

        return () => {
            clearInterval(rescheduleInterval);

            if (timeoutRef) {
                clearTimeout(timeoutRef);
            }
        };
    }, [updateCurrentDate, scheduleCurrentDateUpdate]);

    return currentDate;
};

export default useCurrentDate;
