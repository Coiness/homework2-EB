import { http, HttpResponse } from 'msw'

// 示例 handler（根据你项目的 API 修改）
export const handlers = [
  http.get('/api/user', () => {
    return HttpResponse.json({ id: 1, name: 'Test User' })
  })
]