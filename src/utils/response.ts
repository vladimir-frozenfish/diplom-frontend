import { apiUri } from "../enum/enum"

type HttpMethodType = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
type RequestOptions = {
  method: HttpMethodType
  headers?: Record<string, string>
  body?: URLSearchParams | FormData
}

export async function getResponse(apiPath = '/', responseMethod: HttpMethodType = 'GET', contentType: string = 'application/json', body?: URLSearchParams) {
  const options: RequestOptions = {
    method: responseMethod,
  }  
  
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(responseMethod)) {
    options.headers = {'Content-Type': contentType}
    options.body = body
  }

  const response = await fetch(
      new URL(apiPath, apiUri).href,
      options
    )
    if (!response.ok) {throw new Error(`HTTP error! status: ${response.status}`)}
    return response
  }

export async function getResponseFromForm(apiPath = '/', responseMethod: HttpMethodType = 'POST', body: FormData) {
  const options: RequestOptions = {
    method: responseMethod,
    body: body
  }  
  
  const response = await fetch(
      new URL(apiPath, apiUri).href,
      options
    )
    if (!response.ok) {throw new Error(`HTTP error! status: ${response.status}`)}
    return response
  }
  