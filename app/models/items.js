const db = require('../services/db');

class Item {
  // Id of the item
  item_id;

  // Item details
  item_name;

  // Prices and discount
  actual_price;
  reduce_price;
  discount;

  // Store details
  store_id;
  items_available;

  constructor(item_name, actual_price, reduce_price, discount, store_id, items_available) {
    this.item_name = item_name;
    this.actual_price = actual_price;
    this.reduce_price = reduce_price;
    this.discount = discount;
    this.store_id = store_id;
    this.items_available = items_available;
  }

  // Create a new item
  async createItem() {
    let sql = "INSERT INTO items (item_name, actual_price, reduce_price, discount, store_id, items_available) VALUES (?, ?, ?, ?, ?, ?)";
    const result = await db.query(sql, [this.item_name, this.actual_price, this.reduce_price, this.discount, this.store_id, this.items_available]);
    this.item_id = result.insertId;
    return true;
  }

  // Read items for a store
  static async getItemsByStore(storeId) {
    let sql = "SELECT * FROM items WHERE store_id = ?";
    const results = await db.query(sql, [storeId]);
    return results;
  }

  // Read an item by ID
  static async getItemById(itemId) {
    let sql = "SELECT items.*,store.* FROM items,store WHERE store.store_id = items.store_id and item_id = ?";
    const results = await db.query(sql, [itemId]);
    return results;
  }

  // Update an item
  async updateItem() {
    let sql = "UPDATE items SET item_name = ?, actual_price = ?, reduce_price = ?, discount = ?, items_available = ? WHERE item_id = ?";
    await db.query(sql, [this.item_name, this.actual_price, this.reduce_price, this.discount, this.items_available, this.item_id]);
    return true;
  }

  // Delete an item
  static async deleteItem(itemId) {
    let sql = "DELETE FROM items WHERE item_id = ?";
    await db.query(sql, [itemId]);
    return true;
  }
}

module.exports = {
  Item
};
