'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here if needed in the future
    }
  }
  
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,  // Name is required
      validate: {
        notEmpty: true,  // Name cannot be an empty string
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,  // Price is required
      validate: {
        isFloat: true,  // Ensures price is a valid float
        min: 0,  // Price must be greater than or equal to 0
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,  // Description is optional
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,  // Category is required
      validate: {
        notEmpty: true,  // Category cannot be an empty string
      },
    },
  }, {
    sequelize,
    modelName: 'Product',
  });
  
  return Product;
};
