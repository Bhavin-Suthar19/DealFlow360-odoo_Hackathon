import { Product, ProductVariant, Category } from '../../models/index.js';
import { paginate } from '../../utils/paginate.util.js';

export class ProductsService {
  async getAll(query = {}) {
    const filter = {};
    if (query.category_id) filter.category_id = query.category_id;
    if (query.is_subscription !== undefined) filter.is_subscription = query.is_subscription === 'true';
    if (query.search) filter.name = { $regex: query.search, $options: 'i' };

    return paginate(Product, filter, {
      page: query.page,
      limit: query.limit,
      populate: ['category_id']
    });
  }

  async getById(id) {
    const product = await Product.findById(id).populate('category_id');
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }
    const variants = await ProductVariant.find({ product_id: id });
    return { product, variants };
  }

  async create(data) {
    if (!data.is_subscription && data.recurring_cycle) {
      const err = new Error('recurring_cycle must be null unless is_subscription is true');
      err.statusCode = 400;
      throw err;
    }
    const category = await Category.findById(data.category_id);
    if (!category) {
      const err = new Error('Category not found');
      err.statusCode = 404;
      throw err;
    }
    return Product.create({
      ...data,
      recurring_cycle: data.is_subscription ? data.recurring_cycle : null
    });
  }

  async update(id, data) {
    const product = await Product.findById(id);
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }
    const isSub = data.is_subscription !== undefined ? data.is_subscription : product.is_subscription;
    const cycle = data.recurring_cycle !== undefined ? data.recurring_cycle : product.recurring_cycle;

    if (!isSub && cycle) {
      const err = new Error('recurring_cycle must be null unless is_subscription is true');
      err.statusCode = 400;
      throw err;
    }

    Object.assign(product, data);
    if (!isSub) product.recurring_cycle = null;
    await product.save();
    return product;
  }

  async delete(id) {
    const product = await Product.findById(id);
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }
    await ProductVariant.deleteMany({ product_id: id });
    await Product.deleteOne({ _id: id });
    return { message: 'Product deleted successfully' };
  }

  async addVariant(productId, data) {
    const product = await Product.findById(productId);
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }
    return ProductVariant.create({
      product_id: productId,
      ...data
    });
  }

  async updateVariant(variantId, data) {
    const variant = await ProductVariant.findById(variantId);
    if (!variant) {
      const err = new Error('Variant not found');
      err.statusCode = 404;
      throw err;
    }
    Object.assign(variant, data);
    await variant.save();
    return variant;
  }

  async deleteVariant(variantId) {
    const variant = await ProductVariant.findById(variantId);
    if (!variant) {
      const err = new Error('Variant not found');
      err.statusCode = 404;
      throw err;
    }
    await ProductVariant.deleteOne({ _id: variantId });
    return { message: 'Variant deleted successfully' };
  }
}

export const productsService = new ProductsService();
export default productsService;
