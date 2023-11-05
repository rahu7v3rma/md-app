module.exports = {
    root: true,
    extends: ['@react-native'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'import'],
    overrides: [
        {
            files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
            rules: {
                '@typescript-eslint/no-shadow': ['error'],
                '@typescript-eslint/no-unused-vars': [
                    'error',
                    {
                        argsIgnorePattern: '^_',
                        varsIgnorePattern: '^_'
                    }
                ],
                'comma-dangle': 'off',
                'no-shadow': 'off',
                'no-undef': 'off',
                'react/self-closing-comp': ['error'],
                'import/newline-after-import': ['error'],
                'import/no-duplicates': ['error'],
                'import/no-absolute-path': ['error'],
                'import/order': [
                    'error',
                    {
                        alphabetize: {
                            caseInsensitive: true,
                            order: 'asc'
                        },
                        groups: [
                            'builtin',
                            'external',
                            'internal',
                            'parent',
                            'sibling',
                            'index'
                        ],
                        'newlines-between': 'always',
                        pathGroups: [
                            {
                                pattern: '@/**',
                                group: 'internal'
                            }
                        ]
                    }
                ]
            }
        },
        {
            files: ['!src/reducers/*'],
            rules: {
                'no-restricted-imports': [
                    'error',
                    {
                        paths: [
                            {
                                name: 'react-redux',
                                importNames: ['useSelector']
                            }
                        ]
                    }
                ]
            }
        }
    ]
};
