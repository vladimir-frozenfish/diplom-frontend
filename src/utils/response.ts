import { apiUri } from "../enum/enum"

type HttpMethodType = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
type RequestOptions = {
  method: HttpMethodType
  headers?: Record<string, string>
  body?: string
}

export async function getResponse(apiPath = '/', responseMethod: HttpMethodType = 'GET', body: string = '') {
  const options: RequestOptions = {
    method: responseMethod,
  }  
  
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(responseMethod)) {
    options.headers = {'Content-Type': 'application/json'}
    options.body = body
  }

  const response = await fetch(
      new URL(apiPath, apiUri).href,
      options
    )
    if (!response.ok) {throw new Error(`HTTP error! status: ${response.status}`)}
    return response
  }
