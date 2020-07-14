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
  let globalData;
  Category.find(condition)
    .then(data => {
      globalData=data;
      let respoinseData=data.filter(item=>item.parentcategory===0 || item.parentcategory===null || item.parentcategory==='');
      respoinseData.forEach(element => {
        var someData= getCategories(element.id);
        respoinseData[0].ChildCategory = someData;
      });
      res.send(respoinseData);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving categories."
      });
    });

    getCategories = function(parentid){
      let childItem=globalData.filter(item=>item.parentcategory===parentid)
      if(childItem.length>0){
        childItem.forEach(element=>{
          childItem.ChildCategory=element;
          getCategories(element.id)
        })
      }else{
        return;
      }
      return childItem;
    }
};



// exports.getCategories =(data,parentid)=>{
//   if(parentid!==0 && parentid!==undefined && parentid!==''){
//     console.log(data);
//     getCategories(data,parentid)
//   }else{
//     return;
//   }
// }


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
