'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import ConnectDB from '@/lib/db'
import Category from '@/lib/models/Category'
import { checkRole } from '@/utils/roles'

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export async function createCategory(prevState, formData) {
  if (!(await checkRole('admin'))) redirect('/')

  const name = formData.get('name')?.trim()
  if (!name) return { error: 'Name is required' }

  const slug = formData.get('slug')?.trim() || slugify(name)
  const description = formData.get('description')?.trim() || ''
  const image = formData.get('image')?.trim() || ''
  const isActive = formData.get('isActive') === 'true'

  try {
    await ConnectDB()
    await Category.create({ name, slug, description, image, isActive })
    revalidatePath('/admin/dashboard/categories')
    revalidatePath('/categories')
    return { success: true }
  } catch (err) {
    if (err.code === 11000) return { error: 'A category with this slug already exists' }
    return { error: 'Failed to create category' }
  }
}

export async function updateCategory(prevState, formData) {
  if (!(await checkRole('admin'))) redirect('/')

  const id = formData.get('id')
  const name = formData.get('name')?.trim()
  const slug = formData.get('slug')?.trim()
  if (!id || !name || !slug) return { error: 'Missing required fields' }

  const description = formData.get('description')?.trim() || ''
  const image = formData.get('image')?.trim() || ''
  const isActive = formData.get('isActive') === 'true'

  try {
    await ConnectDB()
    await Category.findByIdAndUpdate(id, { name, slug, description, image, isActive })
    revalidatePath('/admin/dashboard/categories')
    revalidatePath('/categories')
    return { success: true }
  } catch (err) {
    if (err.code === 11000) return { error: 'A category with this slug already exists' }
    return { error: 'Failed to update category' }
  }
}

export async function deleteCategory(prevState, formData) {
  if (!(await checkRole('admin'))) redirect('/')

  const id = formData.get('id')
  if (!id) return { error: 'Missing category ID' }

  try {
    await ConnectDB()
    await Category.findByIdAndDelete(id)
    revalidatePath('/admin/dashboard/categories')
    revalidatePath('/categories')
    return { success: true }
  } catch (err) {
    return { error: 'Failed to delete category' }
  }
}
