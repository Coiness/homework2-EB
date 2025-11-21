// 全局测试初始化
import {beforeAll,afterAll,afterEach} from 'vitest'
import '@testing-library/jest-dom';
import 'whatwg-fetch'
// MSW server (node) 初始化
import {server} from './mocks/server'

beforeAll(() => server.listen({onUnhandledRequest:'warn'}))
afterEach(() => server.resetHandlers());
afterAll(() => server.close())


