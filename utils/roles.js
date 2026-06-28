// import { Roles } from '@/types/globals'
import { auth } from '@clerk/nextjs/server'

export const checkRole = async (role) => {
  const { sessionClaims } = await auth()
  return sessionClaims?.metadata.role === role
}