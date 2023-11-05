import logActivity from '@/assets/svg/logActivity.svg';
import logBlood from '@/assets/svg/logBlood.svg';
import logFast from '@/assets/svg/logFastIcon.svg';
import logFood from '@/assets/svg/logFood.svg';
import logHydration from '@/assets/svg/logHydration.svg';
import logInsulin from '@/assets/svg/logInsulin.svg';
import logMedication from '@/assets/svg/logMedication.svg';
import logWeight from '@/assets/svg/logWeight.svg';

export const DateTimeFormat = 'DD/MM/YYYY HH:mm';

export const Constants: any = {
    trackerTitle: {
        tracked: 'Fast tracking is Paused',
        complete: 'Fast was completed',
        tracking: 'Fast in progress'
    },
    notificationType: {
        STREAM_CHAT_MESSAGE: 'message.new',
        LOG_REMINDER: 'log.reminder',
        LESSON_REMINDER: 'lesson.reminder',
        FAST_COMPLETE: 'fast.complete'
    },
    logs: {
        userFast: 'UserFast',
        userWeight: 'UserWeight',
        userInsulin: 'UserInsulin',
        userExercise: 'UserExercise',
        userGlucose: 'UserGlucose',
        userDrink: 'UserDrink',
        userMedication: 'UserMedication',
        userFood: 'UserFood',
        userLesson: 'UserLesson'
    },
    logTypeDetails: {
        UserGlucose: {
            icon: logBlood,
            title: 'Glucose',
            screen: 'LogBlood'
        },
        UserMedication: {
            icon: logMedication,
            title: 'Medication',
            screen: 'LogMedication'
        },
        UserDrink: {
            icon: logHydration,
            title: 'Drink',
            screen: 'LogWaterIntake'
        },
        UserWeight: {
            icon: logWeight,
            screen: 'LogWeight',
            title: 'Weight'
        },
        UserFast: {
            icon: logFast,
            title: 'Fast',
            screen: 'LogFast'
        },
        UserExercise: {
            icon: logActivity,
            title: 'Activity',
            screen: 'LogActivity'
        },
        UserInsulin: {
            icon: logInsulin,
            title: 'Insulin',
            screen: 'LogInsulin'
        },
        UserFood: {
            icon: logFood,
            title: 'Food',
            screen: 'LogMeal'
        },
        UserLesson: {
            icon: logActivity,
            title: 'Lesson Completed',
            screen: 'LessonContent'
        }
    },
    logTabsList: [
        {
            id: 1,
            icon: logBlood,
            title: 'Log Blood Glucose',
            screen: 'LogBlood',
            type: 'UserGlucose'
        },
        {
            id: 2,
            icon: logHydration,
            title: 'Log Hydration',
            screen: 'LogWaterIntake',
            type: 'UserDrink'
        },
        {
            id: 3,
            icon: logActivity,
            title: 'Log Activity',
            screen: 'LogActivity',
            type: 'UserExercise'
        },
        {
            id: 4,
            icon: logFood,
            title: 'Log a Meal',
            screen: 'LogMeal',
            type: 'UserFood'
        },
        {
            id: 5,
            icon: logMedication,
            title: 'Log Medication',
            screen: 'LogMedication',
            type: 'UserMedication'
        },
        {
            id: 6,
            icon: logWeight,
            title: 'Log Weight',
            screen: 'LogWeight',
            type: 'UserWeight'
        },
        {
            id: 7,
            icon: logFast,
            title: 'Log a Fast',
            screen: 'LogFast',
            type: 'UserFast'
        },
        {
            id: 8,
            icon: logInsulin,
            title: 'Log Insulin',
            screen: 'LogInsulin',
            type: 'UserInsulin'
        }
    ],
    trackFast: {
        state: {
            tracking: 'tracking',
            tracked: 'tracked',
            complete: 'complete',
            empty: ''
        }
    },
    userDataList: [
        {
            name: 'Tamara Green',
            message: 'Hello! Did you mean this?',
            time: '14/03/2023 9:00'
        },
        {
            name: 'Adam Storm',
            message: 'Hello! Did you mean this?',
            time: '13/03/2023 08:20'
        },
        {
            name: 'Samantha Green',
            message: 'Hello! Did you mean this?',
            time: '12/03/2023 13:50'
        },
        {
            name: 'Kristen Stuart',
            message: 'Hello! Did you mean this?',
            time: '12/03/2023 10:05'
        },
        {
            name: 'Adam Storm',
            message: 'Hello! Did you mean this?',
            time: '05/03/2023 11:50'
        },
        {
            name: 'Tamara Green',
            message: 'Hello! Did you mean this?',
            time: '05/02/2023 09:50'
        },
        {
            name: 'Adriana Cole',
            message: 'Hello! Did you mean this?',
            time: '06/02/2023 16:00'
        },
        {
            name: 'Adriana Cole',
            message: 'Hello! Did you mean this?',
            time: '06/02/2023 15:00'
        },
        {
            name: 'Adriana Cole',
            message: 'Hello! Did you mean this?',
            time: '06/02/2023 13:10'
        },
        {
            name: 'Adriana Cole',
            message: 'Hello! Did you mean this?',
            time: '08/02/2023 17:50'
        },
        {
            name: 'Adriana Cole',
            message: 'Hello! Did you mean this?',
            time: '01/01/2023 10:40'
        },
        {
            name: 'Samantha Green',
            message: 'Hello! Did you mean this?',
            time: '01/01/2023 21:30'
        },
        {
            name: 'Kristen Stuart',
            message: 'Hello! Did you mean this?',
            time: '02/01/2023 08:10'
        },
        {
            name: 'Adam Storm',
            message: 'Hello! Did you mean this?',
            time: '02/01/2023 12:00'
        },
        {
            name: 'Tamara Green',
            message: 'Hello! Did you mean this?',
            time: '03/01/2023 16:00'
        },
        {
            name: 'Samantha Green',
            message: 'Hello! Did you mean this?',
            time: '06/01/2023 19:00'
        },
        {
            name: 'Kristen Stuart',
            message: 'Hello! Did you mean this?',
            time: '08/01/2023 11:40'
        }
    ],
    confirmationDialog: {
        title: {
            discard: 'Do you want to discard your changes?',
            delete: 'Are you sure you want to delete this log?'
        }
    },
    errors: {
        futureTime: 'You can not select future time.',
        fastDuration: 'The logged time should be greater than 0',
        exerciseDuration: 'The exercise duration should be greater than 0',
        logValue: 'The log value should be greater than 0'
    }
};
