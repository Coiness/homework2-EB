import {defineConfig} from 'vitest/config'

export default defineConfig({
    test:{
        environment: 'jsdom',    // 浏览器环境
        globals: true,           // 使用 describle/test/globals 语法
        setupFiles: ['./tests/setupTests.ts'],
        include: ['**/*.{test,spec}.{ts,tsx}'],
        coverage: {
            reporter: ['text','lcov']
        },
        // transformMode 默认使用 esbuild 来转换 TS/JSX，通常不需要额外插件
    }
})
