module.exports = {
    preset: 'react-native',
    setupFiles: [
        './node_modules/react-native-gesture-handler/jestSetup.js',
        '<rootDir>/src/jestSetup.js'
    ],
    testEnvironment: 'jsdom',
    globals: {
        __DEV__: true
    },
    transformIgnorePatterns: [
        'node_modules/(?!(jest-)?react-native(-.*)?|@aws-sdk|uuid|@bugsnag/react-native|@notifee(.*)?|@react-native(-community)?|@rneui|stream-chat(-.*)?)'
    ],
    moduleNameMapper: {
        '\\.png$': '<rootDir>/empty-module.js'
    }
};
