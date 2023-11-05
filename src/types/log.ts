import moment from 'moment';

export type LogActivityRequestBody = {
    log_time: string;
    duration_minutes: number;
    activity_type: string;
    intensity: string;
};

type UnitWithSystem = {
    unit: string;
    system: string | null;
};

export type PickerValues = {
    hydration: {
        units: UnitWithSystem[];
    };
    weight: {
        units: UnitWithSystem[];
    };
    glucose: {
        measurement_types: string[];
        units: UnitWithSystem[];
    };
    medication: {
        drugs: string[];
        doses: UnitWithSystem[];
    };
    insulin: {
        injection_types: string[];
    };
    exercise: {
        types: string[];
        intensities: string[];
    };
};

export type logTypes =
    | 'UserExercise'
    | 'UserWeight'
    | 'UserFast'
    | 'UserInsulin'
    | 'UserGlucose'
    | 'UserDrink'
    | 'UserMedication'
    | 'UserFood'
    | 'UserLesson';

export type EditLogActivity = {
    id: number;
    type: logTypes;
    log_time: string;
    duration_minutes: string;
    activity_type: string;
    intensity: string;
};

export type EditLogDrink = {
    id: number;
    type: logTypes;
    log_time: string;
    amount: string | number;
    unit: string;
};

export type EditLogBlood = {
    id: number;
    type: logTypes;
    log_time: string;
    amount: number | string;
    unit: string;
    measurement_type: string;
};

export type EditLogInsulin = {
    id: number;
    type: logTypes;
    log_time: string;
    units: number | string;
    injection_type: string;
};

export type EditLogMedication = {
    id: number;
    type: logTypes;
    log_time: string;
    amount: number | string;
    unit: string;
    drug_name: string;
};

export type EditLogFast = {
    id: number;
    type: logTypes;
    log_time: string;
    duration_minutes: number | string;
};

export type EditLogWeight = {
    id: number;
    type: logTypes;
    log_time: string;
    amount: number | string;
    unit: string;
};

export type EditLogFood = {
    id: number;
    type: logTypes;
    log_time: string;
    image: string;
};

export type recentLogs = {
    count: number;
    nextPage: number | null;
    data: any[];
};

export type dailyCompletedLogs = {
    UserFast: {
        status: boolean;
        date: moment.Moment | null;
    } | null;
    UserWeight?: {
        status: boolean;
        date: moment.Moment | null;
    } | null;
    UserInsulin?: {
        status: boolean;
        date: moment.Moment | null;
    } | null;
    UserExercise?: {
        status: boolean;
        date: moment.Moment | null;
    } | null;
    UserGlucose?: {
        status: boolean;
        date: moment.Moment | null;
    } | null;
    UserDrink?: {
        status: boolean;
        date: moment.Moment | null;
    } | null;
    UserMedication: {
        status: boolean;
        date: moment.Moment | null;
    } | null;
    UserLesson?: {
        status: boolean;
        date: moment.Moment | null;
    } | null;
    UserFood?: {
        status: boolean;
        date: moment.Moment | null;
    } | null;
};

export type logItem = {
    id: number;
    icon: any;
    title: string;
    screen: string;
    type: logTypes;
};

export type LogInputValue = {
    id: number;
    name: string;
};
