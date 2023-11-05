import axios, { AxiosError } from 'axios';
import moment from 'moment';

import { LogActivityRequestBody } from '@/types/log';
import {
    AUTHORIZATION_HEADER_NAME,
    getAuthorizationHeaderValue,
    setAuthToken
} from '@/utils/auth';
import { COMMON } from '@/utils/common';

const API_END_POINT = {
    LOGIN: 'user/login',
    GET_USER_JOURNEY: 'content/journey',
    GET_LESSON: 'content/lesson/{0}/content',
    COMPLETE_LESSON: 'content/lesson/{0}/complete',
    FIRST_CHANGE_PASSWORD: 'user/login/change-password',
    CHANGE_PASSWORD: 'user/change-password',
    GET_PROFILE: 'profile/',
    REFRESH_PROFILE_SESSION: 'profile/session',
    UPDATE_PROFILE: 'profile/',
    IMAGE_UPLOAD: 'image/upload',
    RESET_PASSWORD: 'user/reset/request',
    RESET_PASSWORD_VERIFY: 'user/reset/verify',
    RESET_PASSWORD_CONFIRM: 'user/reset/confirm',
    DELETE_ACCOUNT: 'user/delete',
    LOG_MEAL: 'log/food',
    LOG_EXERCISE: 'log/exercise',
    LOG_MEDICATION: 'log/medication',
    GET_LOG_PICKER_VALUES: 'log/picker-values',
    LOG_FAST: 'log/fast',
    UPDATE_FAST: 'log/fast/{0}/',
    LOG_WEIGHT: 'log/weight',
    LOG_WATER_INTAKE: 'log/drink',
    LOG_BLOOD: 'log/glucose',
    LOG_INSULIN: 'log/insulin',
    LOG_RECENT: 'log/recent?page={0}&limit={1}',
    UPDATE_LOG_MEDICATION: 'log/medication/{0}/',
    UPDATE_LOG_WEIGHT: 'log/weight/{0}/',
    UPDATE_LOG_BLOOD: 'log/glucose/{0}/',
    UPDATE_LOG_INSULIN: 'log/insulin/{0}/',
    UPDATE_LOG_WATER_INTAKE: 'log/drink/{0}/',
    UPDATE_LOG_MEAL: 'log/food/{0}/',
    UPDATE_LOG_ACTIVITY: 'log/exercise/{0}/',
    GET_DAILY_TASKS: 'content/daily-tasks',
    GET_COACH: 'user/coach',
    DAILY_COMPLETED_LOGS: '/log/daily-completed-logs-task?date={0}',
    DELETE_MEAL_LOG: '/log/food/delete/{0}/',
    DELETE_WATER_IN_TAKE_LOG: '/log/drink/delete/{0}/',
    DELETE_BLOOD_LOG: '/log/glucose/delete/{0}/',
    DELETE_FAST_LOG: 'log/fast/delete/{0}/',
    DELETE_LOG_WEIGHT: '/log/weight/delete/{0}/',
    DELETE_ACTIVITY_LOG: 'log/exercise/delete/{0}/',
    DELETE_LOG_INSULIN: 'log/insulin/delete/{0}/',
    DELETE_LOG_MEDICATION: '/log/medication/delete/{0}/',
    NOTIFICATION_LIST: 'user/notification?page={0}&limit={1}',
    UPDATE_NOTIFICATION: 'user/notification/{0}'
};

type API_METHOD = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export const login = async (email: string, password: string) => {
    return _baseRequest(API_END_POINT.LOGIN, 'POST', { email, password }).then(
        (loginResponse) => {
            const authToken = loginResponse.auth_token;
            delete loginResponse.auth_token;

            setAuthToken(authToken);

            return loginResponse;
        }
    );
};

export const firstChangePassword = async (
    email: string,
    old_password: string,
    new_password: string
) => {
    return _baseRequest(API_END_POINT.FIRST_CHANGE_PASSWORD, 'POST', {
        email,
        old_password,
        new_password
    }).then((loginResponse) => {
        const authToken = loginResponse.auth_token;
        delete loginResponse.auth_token;
        setAuthToken(authToken);

        return loginResponse;
    });
};

export const changePassword = async (
    old_password: string,
    new_password: string
) => {
    return _authorizedRequest(API_END_POINT.CHANGE_PASSWORD, 'POST', {
        old_password,
        new_password
    }).then((loginResponse) => {
        const authToken = loginResponse.new_token;
        delete loginResponse.new_token;
        setAuthToken(authToken);

        return loginResponse;
    });
};

export const resetPassword = async (email: string, client: string) => {
    return await _baseRequest(API_END_POINT.RESET_PASSWORD, 'POST', {
        email,
        client
    });
};

export const resetPasswordVerify = async (code: string) => {
    return await _baseRequest(API_END_POINT.RESET_PASSWORD_VERIFY, 'POST', {
        token: code
    });
};

export const resetPasswordConfirm = async (code: string, password: string) => {
    return await _baseRequest(API_END_POINT.RESET_PASSWORD_CONFIRM, 'POST', {
        token: code,
        password
    });
};

export const deleteAccount = async (password: string) => {
    return await _authorizedRequest(API_END_POINT.DELETE_ACCOUNT, 'POST', {
        password
    });
};

export const getUserJourney = async () => {
    return await _authorizedRequest(API_END_POINT.GET_USER_JOURNEY);
};

export const getLesson = async (lessonId: number) => {
    return await _authorizedRequest(
        COMMON.stringFormat(API_END_POINT.GET_LESSON, lessonId)
    );
};

export const completeLesson = async (lessonId: number) => {
    return await _authorizedRequest(
        COMMON.stringFormat(API_END_POINT.COMPLETE_LESSON, lessonId),
        'PUT',
        {
            completion_time: moment().format('YYYY-MM-DD HH:mm:ss')
        }
    );
};

export const createLogMeal = async (logTime: string, image: string) => {
    return await _authorizedRequest(API_END_POINT.LOG_MEAL, 'POST', {
        log_time: logTime,
        image
    });
};

export const updateLogMeal = async (
    id: number | string,
    logTime: string,
    image: string
) => {
    return await _authorizedRequest(
        COMMON.stringFormat(API_END_POINT.UPDATE_LOG_MEAL, id),
        'PUT',
        {
            log_time: logTime,
            image
        }
    );
};

export const createLogWeight = async (
    logTime: string,
    amount: number,
    unit: string
) => {
    return await _authorizedRequest(API_END_POINT.LOG_WEIGHT, 'POST', {
        log_time: logTime,
        amount: amount,
        unit: unit
    });
};

export const createLogFast = async (
    logTime: string,
    durationMinutes: number
) => {
    return await _authorizedRequest(API_END_POINT.LOG_FAST, 'POST', {
        log_time: logTime,
        duration_minutes: durationMinutes
    });
};

export const updateLogActivity = async (
    id: number | string,
    activity_type: string,
    duration_minutes: number | string,
    intensity: number | string,
    log_time: string
) => {
    return await _authorizedRequest(
        COMMON.stringFormat(API_END_POINT.UPDATE_LOG_ACTIVITY, id),
        'PUT',
        {
            activity_type: activity_type,
            duration_minutes: duration_minutes,
            intensity: intensity,
            log_time: log_time
        }
    );
};
export const updateLogFast = async (
    id: number,
    logTime: string,
    durationMinutes: number
) => {
    return await _authorizedRequest(
        COMMON.stringFormat(API_END_POINT.UPDATE_FAST, id),
        'PUT',
        {
            log_time: logTime,
            duration_minutes: durationMinutes
        }
    );
};

export const createWaterIntakeLog = async (
    log_time: string,
    amount: number,
    unit: string
) => {
    return await _authorizedRequest(API_END_POINT.LOG_WATER_INTAKE, 'POST', {
        log_time,
        amount,
        unit
    });
};

export const updateWaterIntakeLog = async (
    id: number | string,
    log_time: string,
    amount: number,
    unit: string
) => {
    return await _authorizedRequest(
        COMMON.stringFormat(API_END_POINT.UPDATE_LOG_WATER_INTAKE, id),
        'PUT',
        {
            log_time,
            amount,
            unit
        }
    );
};

export const createLogBlood = async (
    logTime: string,
    amount: number,
    unit: string,
    measurementType: string
) => {
    return await _authorizedRequest(API_END_POINT.LOG_BLOOD, 'POST', {
        log_time: logTime,
        amount,
        unit,
        measurement_type: measurementType
    });
};

export const updateLogBlood = async (
    id: number | string,
    logTime: string,
    amount: number,
    unit: string,
    measurementType: string
) => {
    return await _authorizedRequest(
        COMMON.stringFormat(API_END_POINT.UPDATE_LOG_BLOOD, id),
        'PUT',
        {
            log_time: logTime,
            amount,
            unit,
            measurement_type: measurementType
        }
    );
};

export const createLogInsulin = async (
    logTime: string,
    units: number,
    injectionType: string
) => {
    return await _authorizedRequest(API_END_POINT.LOG_INSULIN, 'POST', {
        log_time: logTime,
        units,
        injection_type: injectionType
    });
};

export const updateLogInsulin = async (
    id: number | string,
    logTime: string,
    units: number,
    injectionType: string
) => {
    return await _authorizedRequest(
        COMMON.stringFormat(API_END_POINT.UPDATE_LOG_INSULIN, id),
        'PUT',
        {
            log_time: logTime,
            units,
            injection_type: injectionType
        }
    );
};

export const deleteLogInsulin = async (id: number | string) => {
    return await _authorizedRequest(
        COMMON.stringFormat(API_END_POINT.DELETE_LOG_INSULIN, id),
        'DELETE'
    );
};

export const getProfile = async () => {
    return await _authorizedRequest(API_END_POINT.GET_PROFILE);
};
export const refreshProfileSession = async (
    fcmToken?: string,
    deviceId?: string,
    deviceType?: string,
    utcTimeDiffHours?: number
) => {
    return await _authorizedRequest(
        API_END_POINT.REFRESH_PROFILE_SESSION,
        'POST',
        {
            fcm_token: fcmToken,
            device_id: deviceId,
            device_type: deviceType,
            utc_time_diff_hours: utcTimeDiffHours
        }
    );
};

export const updateProfile = async (image: string) => {
    return await _authorizedRequest(API_END_POINT.UPDATE_PROFILE, 'PUT', {
        image
    });
};

export const getImageUploadCredentials = async (publicImage: boolean) => {
    let apiPath = API_END_POINT.IMAGE_UPLOAD;
    if (publicImage) {
        apiPath = apiPath.concat('?public=1');
    }

    return await _authorizedRequest(apiPath);
};

export const logExercise = async (object: LogActivityRequestBody) => {
    return await _authorizedRequest(API_END_POINT.LOG_EXERCISE, 'POST', object);
};

export const logMedication = async (
    logTime: string,
    amount: number,
    drugName: string,
    dose: string
) => {
    return await _authorizedRequest(API_END_POINT.LOG_MEDICATION, 'POST', {
        log_time: logTime,
        amount: amount,
        drug_name: drugName,
        dose: dose
    });
};

export const updateLogMedication = async (
    id: string,
    logTime: string,
    amount: number,
    drugName: string,
    dose: string
) => {
    return await _authorizedRequest(
        COMMON.stringFormat(API_END_POINT.UPDATE_LOG_MEDICATION, id),
        'PUT',
        {
            log_time: logTime,
            amount: amount,
            drug_name: drugName,
            dose: dose
        }
    );
};

export const deleteLogMedication = async (id: string) => {
    return await _authorizedRequest(
        COMMON.stringFormat(API_END_POINT.DELETE_LOG_MEDICATION, id),
        'DELETE'
    );
};

export const getLogPickerValues = async () => {
    return await _authorizedRequest(API_END_POINT.GET_LOG_PICKER_VALUES);
};

export const getRecentLog = async (page: number, limit: number) => {
    return await _authorizedRequest(
        COMMON.stringFormat(API_END_POINT.LOG_RECENT, page, limit)
    );
};

export const getNotificationList = async (page: number, limit: number) => {
    return await _authorizedRequest(
        COMMON.stringFormat(API_END_POINT.NOTIFICATION_LIST, page, limit)
    );
};

export const updateNotification = async (id: number) => {
    return await _authorizedRequest(
        COMMON.stringFormat(API_END_POINT.UPDATE_NOTIFICATION, id),
        'PATCH'
    );
};

export const updateLogWeight = async (
    logTime: string,
    amount: number,
    unit: string,
    logId: number
) => {
    return await _authorizedRequest(
        COMMON.stringFormat(API_END_POINT.UPDATE_LOG_WEIGHT, logId),
        'PUT',
        {
            log_time: logTime,
            amount: amount,
            unit: unit
        }
    );
};

export const getDailyTasks = async () => {
    return await _authorizedRequest(API_END_POINT.GET_DAILY_TASKS);
};

export const getCoach = async () =>
    await _authorizedRequest(API_END_POINT.GET_COACH);

export const getDailyCompletedLogs = async (date: Date) => {
    return await _authorizedRequest(
        COMMON.stringFormat(
            API_END_POINT.DAILY_COMPLETED_LOGS,
            moment(date).format('YYYY-MM-DD')
        )
    );
};

export const deleteActivityLog = async (logId: string) => {
    return await _authorizedRequest(
        COMMON.stringFormat(API_END_POINT.DELETE_ACTIVITY_LOG, logId),
        'DELETE'
    );
};

export const deleteMealLog = async (logId: string) => {
    return await _authorizedRequest(
        COMMON.stringFormat(API_END_POINT.DELETE_MEAL_LOG, logId),
        'DELETE'
    );
};

export const deleteWaterInTakeLog = async (logId: string) => {
    return await _authorizedRequest(
        COMMON.stringFormat(API_END_POINT.DELETE_WATER_IN_TAKE_LOG, logId),
        'DELETE'
    );
};

export const deleteBloodLog = async (logId: string) => {
    return await _authorizedRequest(
        COMMON.stringFormat(API_END_POINT.DELETE_BLOOD_LOG, logId),
        'DELETE'
    );
};

export const deleteLogWeight = async (logId: string) => {
    return await _authorizedRequest(
        COMMON.stringFormat(API_END_POINT.DELETE_LOG_WEIGHT, logId),
        'DELETE'
    );
};

const _baseRequest = (
    url: string,
    method: API_METHOD = 'GET',
    data?: object,
    headers?: { [key: string]: string }
): Promise<any> => {
    return apiClient
        .request({
            method,
            url,
            headers,
            data
        })
        .then((response) => response.data.data)

        .catch((err: AxiosError | Error) =>
            Promise.reject({
                name: err.name,
                message: err.message,
                status: (err as AxiosError).response?.status || -1,
                data: (err as AxiosError).response?.data
            })
        );
};

export const deleteLogFast = async (logId: string) => {
    return await _authorizedRequest(
        COMMON.stringFormat(API_END_POINT.DELETE_FAST_LOG, logId),
        'DELETE'
    );
};

const _authorizedRequest = (
    url: string,
    method: API_METHOD = 'GET',
    data?: object,
    headers?: { [key: string]: string }
): Promise<any> => {
    return getAuthorizationHeaderValue().then((authHeaderValue) => {
        if (!headers) {
            headers = {};
        }
        headers[AUTHORIZATION_HEADER_NAME] = authHeaderValue || '';
        return _baseRequest(url, method, data, headers);
    });
};

const apiClient = axios.create({
    baseURL: COMMON.apiBaseUrl,
    headers: {
        'Content-type': 'application/json'
    }
});
