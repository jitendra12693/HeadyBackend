module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      categoryname: String,
      description: String,
      parentcategory: String
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Category = mongoose.model("categories", schema);
  return Category;
};
