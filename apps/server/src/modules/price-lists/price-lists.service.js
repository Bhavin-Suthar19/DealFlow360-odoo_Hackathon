import { PriceList, PriceListItem, Product } from '../../models/index.js';
import { paginate } from '../../utils/paginate.util.js';

export class PriceListsService {
  async getAll(query = {}) {
    const filter = {};
    if (query.tier) filter.tier = query.tier;
    return paginate(PriceList, filter, { page: query.page, limit: query.limit });
  }

  async getById(id) {
    const priceList = await PriceList.findById(id);
    if (!priceList) {
      const err = new Error('Price list not found');
      err.statusCode = 404;
      throw err;
    }
    const items = await PriceListItem.find({ price_list_id: id }).populate('product_id');
    return { priceList, items };
  }

  async create(data) {
    return PriceList.create(data);
  }

  async addItem(priceListId, data) {
    const priceList = await PriceList.findById(priceListId);
    if (!priceList) {
      const err = new Error('Price list not found');
      err.statusCode = 404;
      throw err;
    }
    const product = await Product.findById(data.product_id);
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }
    return PriceListItem.create({
      price_list_id: priceListId,
      product_id: data.product_id,
      price: data.price
    });
  }
}

export const priceListsService = new PriceListsService();
export default priceListsService;
