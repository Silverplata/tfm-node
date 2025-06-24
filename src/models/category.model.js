const pool = require('../config/db');

const Category = {
  async getAllCategories() {
    try {
      const [rows] = await pool.query(
        `SELECT category_id, user_id, name, color, created_at, icon, description
         FROM categories`
      );
      return rows;
    } catch (error) {
      throw new Error(`No se pudieron obtener las categorías: ${error.message}`);
    }
  },

  async createCategory({ userId, name, color, icon, description }) {
    try {
      // Validar que el usuario tiene rol de guía
      const [profileRows] = await pool.query(
        'SELECT role FROM profiles WHERE user_id = ?',
        [userId]
      );
      if (!profileRows[0] || profileRows[0].role !== 'guide') {
        throw new Error('Solo los guías pueden crear categorías');
      }

      // Validar campos
      if (!name) {
        throw new Error('El nombre de la categoría es obligatorio');
      }
      if (color && !/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
        throw new Error('El color debe ser un código hexadecimal válido (#RRGGBB o #RGB)');
      }

      // Verificar si la categoría ya existe
      const [existingRows] = await pool.query(
        'SELECT name FROM categories WHERE name = ?',
        [name]
      );
      if (existingRows.length > 0) {
        throw new Error('La categoría ya existe');
      }

      const [result] = await pool.query(
        'INSERT INTO categories (user_id, name, color, icon, description) VALUES (?, ?, ?, ?, ?)',
        [userId, name, color || null, icon || null, description || null]
      );

      return {
        category_id: result.insertId,
        user_id: userId,
        name,
        color: color || null,
        icon: icon || null,
        description: description || null,
        created_at: new Date()
      };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('La categoría ya existe');
      }
      throw new Error(`No se pudo crear la categoría: ${error.message}`);
    }
  }
};

module.exports = Category;