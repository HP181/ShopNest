'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import ConnectDB from '@/lib/db'
import Product from '@/lib/models/Product'
import { checkRole } from '@/utils/roles'

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function parseList(raw) {
  return raw ? raw.split(',').map((s) => s.trim()).filter(Boolean) : []
}

export async function createProduct(prevState, formData) {
  if (!(await checkRole('admin'))) redirect('/')

  const name = formData.get('name')?.trim()
  const description = formData.get('description')?.trim()
  const priceRaw = formData.get('price')
  const price = parseFloat(priceRaw)

  if (!name || !description || isNaN(price)) {
    return { error: 'Name, description and price are required' }
  }

  const categoryId = formData.get('categoryId')
  const categorySlug = formData.get('categorySlug')
  const slug = formData.get('slug')?.trim() || slugify(name)
  const comparePriceRaw = formData.get('comparePrice')
  const comparePrice = comparePriceRaw ? parseFloat(comparePriceRaw) : null
  const stock = parseInt(formData.get('stock')) || 0
  const sku = formData.get('sku')?.trim() || ''
  const isFeatured = formData.get('isFeatured') === 'true'
  const isActive = formData.get('isActive') === 'true'
  const images = parseList(formData.get('images'))
  const tags = parseList(formData.get('tags')).map((t) => t.toLowerCase())

  try {
    await ConnectDB()
    await Product.create({
      name, slug, description, price, comparePrice,
      stock, sku, isFeatured, isActive, images, tags,
      category: categoryId,
    })
    revalidatePath(`/admin/dashboard/categories/${categorySlug}`)
    revalidatePath(`/categories/${categorySlug}`)
    return { success: true }
  } catch (err) {
    if (err.code === 11000) return { error: 'A product with this slug already exists' }
    return { error: 'Failed to create product' }
  }
}

export async function updateProduct(prevState, formData) {
  if (!(await checkRole('admin'))) redirect('/')

  const id = formData.get('id')
  const name = formData.get('name')?.trim()
  const slug = formData.get('slug')?.trim()
  const description = formData.get('description')?.trim()
  const priceRaw = formData.get('price')
  const price = parseFloat(priceRaw)

  if (!id || !name || !slug || !description || isNaN(price)) {
    return { error: 'Missing required fields' }
  }

  const categorySlug = formData.get('categorySlug')
  const comparePriceRaw = formData.get('comparePrice')
  const comparePrice = comparePriceRaw ? parseFloat(comparePriceRaw) : null
  const stock = parseInt(formData.get('stock')) || 0
  const sku = formData.get('sku')?.trim() || ''
  const isFeatured = formData.get('isFeatured') === 'true'
  const isActive = formData.get('isActive') === 'true'
  const images = parseList(formData.get('images'))
  const tags = parseList(formData.get('tags')).map((t) => t.toLowerCase())

  try {
    await ConnectDB()
    await Product.findByIdAndUpdate(id, {
      name, slug, description, price, comparePrice,
      stock, sku, isFeatured, isActive, images, tags,
    })
    revalidatePath(`/admin/dashboard/categories/${categorySlug}`)
    revalidatePath(`/categories/${categorySlug}`)
    return { success: true }
  } catch (err) {
    if (err.code === 11000) return { error: 'A product with this slug already exists' }
    return { error: 'Failed to update product' }
  }
}

export async function deleteProduct(prevState, formData) {
  if (!(await checkRole('admin'))) redirect('/')

  const id = formData.get('id')
  const categorySlug = formData.get('categorySlug')
  if (!id) return { error: 'Missing product ID' }

  try {
    await ConnectDB()
    await Product.findByIdAndDelete(id)
    revalidatePath(`/admin/dashboard/categories/${categorySlug}`)
    revalidatePath(`/categories/${categorySlug}`)
    return { success: true }
  } catch (err) {
    return { error: 'Failed to delete product' }
  }
}
