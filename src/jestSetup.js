import mockRNCameraRoll from '@react-native-camera-roll/camera-roll/src/__mocks__/nativeInterface';
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock';
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock';

import { MockData } from './utils/mockData';

// setImmediate and clearImmediate aren't mocked by useFakeTimers if they are
// not set to a function (https://github.com/jestjs/jest/pull/11599)
global.setImmediate = jest.fn();
global.clearImmediate = jest.fn();
jest.useRealTimers();

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('react-native-keychain', () => {
    return {
        SECURITY_LEVEL_ANY: 'MOCK_SECURITY_LEVEL_ANY',
        SECURITY_LEVEL_SECURE_SOFTWARE: 'MOCK_SECURITY_LEVEL_SECURE_SOFTWARE',
        SECURITY_LEVEL_SECURE_HARDWARE: 'MOCK_SECURITY_LEVEL_SECURE_HARDWARE',
        setGenericPassword: jest.fn().mockResolvedValue(),
        getGenericPassword: jest.fn().mockResolvedValue(false),
        resetGenericPassword: jest.fn().mockResolvedValue()
    };
});

jest.mock('react-native-splash-screen', () => {
    return {
        hide: jest.fn()
    };
});

export let mockUnwrap = jest.fn().mockImplementation(() => {
    return Promise.resolve({});
});
export const mockDispatch = jest.fn().mockImplementation(() => {
    return {
        unwrap: mockUnwrap
    };
});
jest.mock('@/hooks', () => ({
    useAppDispatch: () => mockDispatch,
    useChannelPreviewInfo: () => mockDispatch
}));
export const mockChannelId = 'mockChannelId';
export const mockChatClient = jest.fn().mockImplementation(() => ({
    userID: 1,
    chat_id: 1,
    queryChannels: jest.fn().mockImplementation(() => {
        return Promise.resolve([
            {
                cid: 99
            }
        ]);
    }),
    activeChannels: {
        mockChannelId
    }
}));
jest.mock('@/contexts/appChat', () => ({
    useAppChat: () => {
        return {
            chatClient: mockChatClient(),
            setActiveChatChannel: jest.fn()
        };
    }
}));
export const mockRNSha256 = jest
    .fn()
    .mockImplementation(() => Promise.resolve('123'));
jest.mock('react-native-sha256', () => {
    return {
        sha256: mockRNSha256
    };
});

jest.mock('react-native-share', () => ({
    default: jest.fn()
}));

jest.mock('@/services/api', () => ({
    getImageUploadCredentials: jest.fn(() => ({
        keyPrefix: 'keyPrefix',
        fileName: 'fileName',
        bucketName: 'bucketName'
    }))
}));

jest.mock('@/reducers/content', () => ({
    ContentSelectors: jest.fn().mockImplementation(() => ({
        loading: false,
        journey: MockData.journey,
        navigationKey: 'Main.Home',
        activeBlock: MockData.activeBlock,
        activeLesson: {
            lesson: {}
        },
        journeyBlocks: MockData.journeyBlocks
    })),
    loadJourney: jest.fn(),
    getActiveLesson: jest.fn()
}));

export const mockChatProfile = jest.fn(() => ({
    apiKey: 'apiKey',
    token: 'token',
    userId: 'userId',
    firebasePushProviderName: 'firebasePushProviderName'
}));
export const mockDeleteAccount = jest.fn();
jest.mock('@/reducers/user', () => ({
    UserSelectors: jest.fn().mockImplementation(() => ({
        loading: false,
        userInfo: {
            username: 'user1',
            first_name: 'Some',
            last_name: 'Name',
            email: 'user1@example.example'
        },
        userProfile: {
            diabetes_type: 'Prediabetes',
            image: null,
            onboarding_form_url: null
        },
        coach: {
            first_name: 'name',
            profile_image: 'profile_image'
        },
        chatProfile: mockChatProfile(),
        hasCoachChat: false
    })),
    userLogin: jest.fn(),
    changePassword: jest.fn(),
    resetPassword: jest.fn(),
    resetPasswordConfirm: jest.fn(),
    resetPasswordVerify: jest.fn(),
    getCoach: jest.fn(),
    refreshProfileSession: jest.fn(),
    getProfile: jest.fn(),
    searchFilterAction: jest.fn(),
    clearSearchText: jest.fn(),
    deleteAccount: mockDeleteAccount
}));
export const mockRNFSExists = jest
    .fn()
    .mockImplementation(() => Promise.resolve(false));
export const mockRNFSCachesDirectoryPath = 'mockCachesDirectoryPath';
export const mockRNFSDownloadFile = jest.fn().mockImplementation(() => ({
    promise: Promise.resolve({ statusCode: 200 })
}));
jest.mock('react-native-fs', () => {
    return {
        readFile: jest.fn(),
        exists: mockRNFSExists,
        CachesDirectoryPath: mockRNFSCachesDirectoryPath,
        downloadFile: mockRNFSDownloadFile,
        unlink: jest.fn().mockImplementation(() => Promise.resolve())
    };
});
jest.mock('react-native-image-crop-picker', () => {
    return {
        openPicker: jest.fn(),
        launchImageLibrary: jest.fn(),
        openCamera: jest.fn()
    };
});

jest.mock('@react-native-camera-roll/camera-roll', () => mockRNCameraRoll);
jest.mock('react-native-reanimated', () => ({
    ...require('react-native-reanimated/mock')
}));
jest.mock('react-native-device-info', () => mockRNDeviceInfo);
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('@/reducers/track', () => ({
    TrackSelectors: jest.fn().mockImplementation(() => ({
        trackFastState: '',
        trackStartedAt: '',
        trackTimeLimitInSeconds: 57600,
        trackedTimeInSeconds: 0
    })),
    trackStart: jest.fn(),
    trackUpdate: jest.fn()
}));

jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);

jest.mock('@notifee/react-native', () =>
    require('@notifee/react-native/jest-mock')
);

export const mockOnTokenRefresh = jest.fn();
jest.mock('@react-native-firebase/messaging', () => ({
    __esModule: true,
    default: () => ({ onTokenRefresh: mockOnTokenRefresh }),
    FirebaseMessagingTypes: jest.fn()
}));

export const mockNavigate = jest.fn();
export const mockPop = jest.fn();
export const mockGoBack = jest.fn();
export const mockReplace = jest.fn();
export const mockNavigationDispatch = jest.fn();
export const mockUseRoute = jest.fn().mockImplementation(() => ({
    params: {
        id: 1,
        unit: 'kg',
        code: '11111',
        url: 'https://www.google.com/'
    }
}));

jest.mock('@/services/notification', () => ({
    resetNotifications: jest.fn(),
    registerBackgroundNotificationsListener: jest.fn(),
    getFCMToken: jest.fn().mockImplementation(() => {
        return Promise.resolve({});
    }),
    triggerFirebaseForegroundNotification: jest.fn(),
    registerFirebaseMessageListener: jest.fn(),
    requestNotificationPermissions: jest.fn()
}));

jest.mock('@react-navigation/native', () => {
    const real = jest.requireActual('@react-navigation/native');
    return {
        ...real,
        useNavigation: jest.fn().mockImplementation(() => {
            return {
                canGoBack: jest.fn().mockImplementation(() => {
                    return true;
                }),
                goBack: mockGoBack,
                navigate: mockNavigate,
                pop: mockPop,
                replace: mockReplace,
                dispatch: mockNavigationDispatch
            };
        }),
        useRoute: mockUseRoute,
        useIsFocused: jest.fn().mockImplementation(() => ({
            isFocused: true
        })),
        useFocusEffect: jest.fn()
    };
});

export const mockToast = jest.fn();

jest.mock('react-native-toast-message', () => ({
    show: mockToast
}));

export const mockGetChannelDisplayImage = jest.fn();
jest.mock('@/services/chat', () => ({
    getChannelDisplayImage: mockGetChannelDisplayImage
}));

export const mockConnectUser = jest.fn(() => Promise.resolve());
export const mockDisconnectUser = jest.fn();
export const mockGetInstance = jest.fn(() => ({
    connectUser: mockConnectUser,
    disconnectUser: mockDisconnectUser
}));
jest.mock('stream-chat', () => ({
    StreamChat: {
        getInstance: mockGetInstance
    }
}));

jest.mock('@aws-sdk/client-s3', () => ({
    S3Client: jest.fn(() => ({
        send: jest.fn(() => Promise.resolve())
    })),
    PutObjectCommand: jest.fn().mockImplementation(() => {
        return {};
    })
}));
