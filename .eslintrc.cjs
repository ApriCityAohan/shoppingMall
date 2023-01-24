module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-recommended',
        'standard',
        'plugin:prettier/recommended',
        'eslint-config-prettier'
    ],
    overrides: [
        // 这里是添加的代码
        {
            files: ['src/pages/index.vue', 'src/pages/**/*.vue', 'src/components/**/*.vue'], // 匹配views和二级目录中的index.vue
            rules: {
                'vue/multi-word-component-names': 'off'
            } // 给上面匹配的文件指定规则
        }
    ],
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            modules: true
        },
        requireConfigFile: false,
        parser: '@babel/eslint-parser'
    },
    plugins: ['vue'],
    rules: {}
}
