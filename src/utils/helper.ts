export const padNum = (num: number) => {
    return (num < 10 ? '0' : '') + num;
};

export const isTimerValid = (timer: number) => {
    return timer > 0;
};

export const isUnitValid = (unit: number) => {
    return unit > 0;
};
