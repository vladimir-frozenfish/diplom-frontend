import { apiUri } from "../enum/enum"

type HttpMethodType = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export async function getResponse(apiPath = '/', responseMethod: HttpMethodType = 'GET') {
    const response = await fetch(
      new URL(apiPath, apiUri).href,
      {method: responseMethod}
    )
    if (!response.ok) {throw new Error(`HTTP error! status: ${response.status}`)}
    return response
  }
