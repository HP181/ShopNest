'use server'

import { checkRole } from '@/utils/roles'
import { clerkClient } from '@clerk/nextjs/server'

export async function setRole(formData) {
  // Initialize `clerkClient`
  const client = await clerkClient()

  // Check that the user trying to set the Role is an admin
  if (!checkRole('admin')) {
    return { message: 'Not Authorized' }
  }

  try {
    // Use the `updateUserMetadata()` method to update the user's Role
    const res = await client.users.updateUserMetadata(formData.get('id'), {
      publicMetadata: { role: formData.get('role') },
    })
    return { message: res.publicMetadata }
  } catch (err) {
    return { message: err }
  }
}

export async function removeRole(formData) {
  const client = await clerkClient()

  try {
    const res = await client.users.updateUserMetadata(formData.get('id'), {
      publicMetadata: { role: null },
    })
    return { message: res.publicMetadata }
  } catch (err) {
    return { message: err }
  }
}