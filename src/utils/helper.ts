export const padNum = (num: number) => {
    return (num < 10 ? '0' : '') + num;
};

export const isTimerValid = (timer: number) => {
    return timer > 0;
};

export const isUnitValid = (unit: number) => {
    return unit > 0;
};

// Format number to restrict specified digits max after decimal point
export const formatNumber = (num: number, digits = 2) => {
    return +num.toFixed(digits);
};
