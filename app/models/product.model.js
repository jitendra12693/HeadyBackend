module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        productname: String,
        category: String,
        description: String,
        price:Number
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Product = mongoose.model("products", schema);
    return Product;
  };
  