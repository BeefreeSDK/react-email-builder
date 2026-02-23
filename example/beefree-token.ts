import type { IToken } from '@beefree.io/sdk/dist/types/bee'

/**
 * ************************************************************
 *                      !!!! WARNING !!!!                     *
 *                                                            *
 *  This is done on the frontend to get the example working.  *
 *  You must set up a backend server to perform the login.    *
 *  Otherwise, your credentials will be at risk!              *
 *                                                            *
 * ************************************************************
 */
const AUTH_URL = 'https://auth.getbee.io/loginV2'

export async function getBuilderToken(
  clientId: string,
  clientSecret: string,
  userId = 'user',
): Promise<IToken> {
  let response: Response

  try {
    response = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        uid: userId,
      }),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown network error'
    throw new Error(`Network error: unable to reach authentication server (${message})`)
  }

  if (!response.ok) {
    throw new Error(`Authentication failed: ${response.status} ${response.statusText}`)
  }

  const token = await response.json()

  if (!token || !token.access_token) {
    throw new Error('Invalid credentials: no access token returned')
  }

  return token
}
