// include express
const express = require('express');
const app = express();

// include the mustache template engine for express
const mustacheExpress = require('mustache-express');

// include the model so the controller can use its functions
const Model = require('./app.model.js')

// registers the mustache engine with express
app.engine("mustache", mustacheExpress());

// sets mustache to be the view engine
app.set('view engine', 'mustache');

// sets /views to be the /views folder
// files should have the extension filename.mustache
app.set('views', __dirname + '/views');

// ************************* CONTROLLER ACTIONS ****************************

//ascending sort
app.get('/sortasc/:col', function (req, res) {

  function renderPage(realtorArray) {
    res.render('main_page', { realtors: realtorArray });
  }

  Model.sortASC(req.params.col, renderPage);

});

//descending sort
app.get('/sortdesc/:col', function (req, res) {

  function renderPage(realtorArray) {
    res.render('main_page', { realtors: realtorArray });
  }

  Model.sortDESC(req.params.col, renderPage);

});


// delete a realtor action (given an id parameter)
app.get('/delete/:id', function (req, res) {

  // 3. render the page with the realtor data
  function renderPage(realtorArray) {
    res.render('main_page', { realtors: realtorArray });
  }

  // 2. Get all the realtors, then render the page
  function getRealtors() { Model.getAllRealtors(renderPage); }

  // 1. delete the realtor first, then get all the realtors
  Model.deleteRealtor(req.params.id, getRealtors);

});

// delete all realtors with less than 2 likes
app.get('/layoffs', function (req, res) {

  function renderPage(realtorArray) {
    res.render('main_page', { realtors: realtorArray });
  }

  function getRealtors() { Model.getAllRealtors(renderPage); }

  Model.layoffRealtor(getRealtors);

});

// addform action puts the add realtor form on the page
app.get('/addform', function (req, res) {

  // 2. render the page with the realtor data AND display the add form
  function renderPage(realtorArray) {
    res.render('main_page', { addrealtor: true, realtors: realtorArray });
  }

  // 1. get all the realtors, then render the page
  Model.getAllRealtors(renderPage);

});

// addrealtor action handles add form submit, inserts new realtor into table
app.get('/addrealtor', function (req, res) {

  if (!req.query.firstname || !req.query.lastname || !req.query.specialties || (!req.query.likes || isNaN(req.query.likes) || req.query.likes < 0)) {

    let errors = {}
    let errorClasses = {}

    if (!req.query.firstname) {

      errors.firstname = "First Name cannot be blank ";
      errorClasses.firstnameClass = errors.firstname ? "is-invalid" : "";

    }

    if (!req.query.lastname) {

      errors.lastname = "Last Name cannot be blank.";
      errorClasses.lastnameClass = errors.lastname ? "is-invalid" : "";
    }

    if (!req.query.specialties) {

      errors.specialties = "Specialties cannot be blank.";
      errorClasses.specialtiesClass = errors.specialties ? "is-invalid" : "";
    }
    console.log(req.query.likes);
    if (!req.query.likes) {

      errors.likes = "Likes cannot be blank.";
      errorClasses.likesClass = errors.likes ? "is-invalid" : "";

    } else if (isNaN(req.query.likes) || parseInt(req.query.likes) < 0) {
      console.log(req.query.likes);
      errors.likes = "Likes must be a possitive number.";
      errorClasses.likesClass = errors.likes ? "is-invalid" : "";
    }

    function renderPage(realtorArray) {

      res.render('main_page',
        {
          addrealtor: true
          , formdata: {
            firstname: req.query.firstname || '',
            lastname: req.query.lastname || '',
            specialties: req.query.specialties || '',
            likes: req.query.likes || '',
          }
          , realtors: realtorArray
          , errors: errors
          , errorClasses: errorClasses
        });
    }

    Model.getAllRealtors(renderPage);

  }
  else {
    // 3. render the page with the realtor data
    function renderPage(realtorArray) {
      res.render('main_page', { realtors: realtorArray });
    }

    // 2. Get all the realtors, then render the page
    function getRealtors() { Model.getAllRealtors(renderPage); }

    // 1. Insert realtor into table using form data, then get all the realtors
    Model.addRealtor(req.query, getRealtors);

  }
});

//inserts random realtor
app.get('/random', function (req, res) {

  const firstNames = ['John', 'Jane', 'Alex', 'Emily', 'Michael', 'Sarah', 'Robert', 'Laura', 'David', 'Linda'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const specialties = ['Residential', 'Commercial', 'Rental', 'Land', 'Consultation', 'Management'];


  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const randomFirstName = firstNames[getRandomInt(0, firstNames.length - 1)];
  const randomLastName = lastNames[getRandomInt(0, lastNames.length - 1)];
  const randomSpecialty = specialties[getRandomInt(0, specialties.length - 1)];
  const randomLikes = getRandomInt(0, 10);

  const randomRealtor = {
    firstname: randomFirstName,
    lastname: randomLastName,
    specialties: randomSpecialty,
    likes: randomLikes
  };


  // 3. render the page with the realtor data
  function renderPage(realtorArray) {
    res.render('main_page', { realtors: realtorArray });
  }

  // 2. Get all the realtors, then render the page
  function getRealtors() { Model.getAllRealtors(renderPage); }

  // 1. Insert realtor into table using form data, then get all the realtors
  Model.addRealtor(randomRealtor, getRealtors);

});

// updateform action puts the update realtor form on the page
app.get('/updateform/:id', function (req, res) {

  // 2. render the page with the realtor data AND display update form
  function renderPage(realtorArray) {
    // filter the realtorArray for the realtor with the id parameter, that's
    // the realtor that we want to populate the form with (see: formdata)
    res.render('main_page',
      {
        updaterealtor: true
        , updateid: req.params.id
        , formdata: realtorArray.filter(x => (x.rowid == req.params.id))[0]
        , realtors: realtorArray
      });
  }
  // 1. get all the realtors, then render the page
  Model.getAllRealtors(renderPage);

});

// likerealtor action handles incrementing the likes
app.get('/likerealtor/:id', function (req, res) {

  function renderPage(realtorArray) {
    res.render('main_page', { realtors: realtorArray });
  }

  function getRealtors() { Model.getAllRealtors(renderPage); }

  Model.likeRealtor(req.params.id, getRealtors);

});


// updaterealtor action handles updating the realtor in the database
app.get('/updaterealtor/:id', function (req, res) {

  if (!req.query.firstname || !req.query.lastname || !req.query.specialties || (!req.query.likes || isNaN(req.query.likes) || req.query.likes < 0)) {

    let errors = {}
    let errorClasses = {}

    if (!req.query.firstname) {

      errors.firstname = "First Name cannot be blank ";
      errorClasses.firstnameClass = errors.firstname ? "is-invalid" : "";

    }

    if (!req.query.lastname) {

      errors.lastname = "Last Name cannot be blank.";
      errorClasses.lastnameClass = errors.lastname ? "is-invalid" : "";
    }

    if (!req.query.specialties) {

      errors.specialties = "Specialties cannot be blank.";
      errorClasses.specialtiesClass = errors.specialties ? "is-invalid" : "";
    }

    if (!req.query.likes) {

      errors.likes = "Likes cannot be blank.";
      errorClasses.likesClass = errors.likes ? "is-invalid" : "";

    } else if (isNaN(req.query.likes) || req.query.likes < 0) {

      errors.likes = "Likes must be a possitive number.";
      errorClasses.likesClass = errors.likes ? "is-invalid" : "";
    }

    function renderPage(realtorArray) {

      const originalFormData = realtorArray.filter(x => (x.rowid == req.params.id))[0];

      const mergedFormData = {
        firstname: req.query.firstname !== undefined ? req.query.firstname : originalFormData.firstname,
        lastname: req.query.lastname !== undefined ? req.query.lastname : originalFormData.lastname,
        specialties: req.query.specialties !== undefined ? req.query.specialties : originalFormData.specialties,
        likes: req.query.likes !== undefined ? req.query.likes : originalFormData.likes,
      };

      res.render('main_page',
        {
          updaterealtor: true
          , updateid: req.params.id
          , formdata: mergedFormData
          , realtors: realtorArray
          , errors: errors
          , errorClasses: errorClasses
        });
    }

    Model.getAllRealtors(renderPage);

  }
  else {

    // 3. render the page with the realtor data
    function renderPage(realtorArray) {
      res.render('main_page', { realtors: realtorArray });
    }

    // 2. Get all the realtors, then render the page
    function getRealtors() { Model.getAllRealtors(renderPage); }

    // 1. update the realtor in the database, then get all the realtors
    Model.updateRealtor(req.query, req.params.id, getRealtors);

  }
});

// default action: render the page with realtor data
app.get('/', function (req, res) {

  // 2. render the page with the realtor data
  function renderPage(realtorArray) {
    res.render('main_page', { realtors: realtorArray });
  }

  // 1. get all the realtors, then render the page
  Model.getAllRealtors(renderPage);

});

// catch-all router case intended for static files
app.get(/^(.+)$/, function (req, res) {
  res.sendFile(__dirname + req.params[0]);
});

app.listen(8081, function () { console.log("server listening..."); });