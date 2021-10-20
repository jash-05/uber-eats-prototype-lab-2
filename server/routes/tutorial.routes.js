module.exports = app => {
    const tutorials = require("../controllers/tutorial.controller.js");
    
    // Create a new Tutorial
    app.post("/tutorials", tutorials.create);
  
    // Retrieve all Tutorials
    app.get("/tutorials", tutorials.findAll);
  
    // Retrieve all published Tutorials
    app.get("/tutorials/published", tutorials.findAllPublished);
  
    // Retrieve a single Tutorial with id
    app.get("/tutorials/:id", tutorials.findOne);
  
    // Update a Tutorial with id
    app.put("/tutorials/:id", tutorials.update);
  
    // Delete a Tutorial with id
    app.delete("/tutorials/:id", tutorials.delete);
  
    // Create a new Tutorial
    app.delete("/tutorials", tutorials.deleteAll);
  };