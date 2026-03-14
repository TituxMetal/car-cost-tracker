import type { APIRoute } from 'astro'

const API_URL = process.env.API_URL || 'http://localhost:3000'

export const ALL: APIRoute = async ({ params, request }) => {
  const path = params.path || ''
  const url = new URL(request.url)
  const targetUrl = `${API_URL}/api/${path}${url.search}`

  const headers = new Headers(request.headers)
  headers.delete('host')

  const body = ['GET', 'HEAD'].includes(request.method) ? undefined : await request.arrayBuffer()

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
    redirect: 'manual'
  })

  const responseHeaders = new Headers(response.headers)
  responseHeaders.delete('content-encoding')
  responseHeaders.delete('content-length')

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders
  })
}
