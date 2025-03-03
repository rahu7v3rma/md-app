module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        [
            'babel-plugin-inline-import',
            {
                extensions: ['.svg']
            }
        ],
        [
            'module-resolver',
            {
                root: ['./src'],
                extensions: [
                    '.ios.js',
                    '.android.js',
                    '.js',
                    '.ts',
                    '.tsx',
                    '.json'
                ],
                alias: [{ '^@/(.+)': './src/\\1' }]
            }
        ],
        'react-native-reanimated/plugin'
    ]
};
