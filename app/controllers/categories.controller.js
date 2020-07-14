const db = require("../models");
const Category = db.categories;

exports.create = (req, res) => {

  if (!req.body.categoryname) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const category = new Category({
    categoryname: req.body.categoryname,
    description: req.body.description,
    parentcategory: req.body.parentcategory ? req.body.parentcategory : null
  });

  category
    .save(category)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the category."
      });
    });
};

exports.findAll = (req, res) => {
  const categoryName = req.query.categoryname;
  var condition = categoryName ? { categoryName: { $regex: new RegExp(categoryName), $options: "i" } } : {};
  Category.find(condition)
    .then(data => {
        let allCat = JSON.parse(JSON.stringify(data))
         allCat.forEach(eachCat => {
         let filter = allCat.filter(function(cat) {
           return cat.parentcategory === eachCat.id;
         });
         eachCat.child = [];
         eachCat.child.push(filter);
       })
      res.send(allCat.filter(item=> item.parentcategory===null));
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving categories."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Category.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Category with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Category with id=" + id });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Category.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update category with id=${id}. Maybe category was not found!`
        });
      } else res.send({ message: "category was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating category with id=" + id
      });
    });
}; 

exports.delete = (req, res) => {
  const id = req.params.id;
  Category.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete category with id=${id}. Maybe category was not found!`
        });
      } else {
        res.send({
          message: "Category was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete category with id=" + id
      });
    });
};
