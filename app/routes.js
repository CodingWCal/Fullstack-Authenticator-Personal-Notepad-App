const Note = require('./models/Note');

module.exports = function(app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });
    //new way using mongoose
    app.get('/notes', isLoggedIn, (req, res) => {
      Note.find({ userId: req.user._id }, (err, notes) => {
          if (err) {
              console.log(err);
              return res.send(err);
          }
          res.render('notes.ejs', {
              user: req.user,
              notes
          });
      });
  });

  app.get('/profile', isLoggedIn, (req, res) => {
    res.redirect('/notes');
  });

//   app.get('/profile', isLoggedIn, (req, res) => {
//     Note.find({ userId: req.user._id }, (err, notes) => {
//         if (err) return res.send(err);
//         res.render('profile.ejs', {
//           user: req.user,
//           notes: notes
//         });
//       });
//     });

    //referenced old app post but used mongoose
    app.post('/notes', isLoggedIn, (req, res) => {
      const newNote = new Note({
          userId: req.user._id,
          title: req.body.title,
          content: req.body.content
      });
  
      newNote.save((err) => {
          if (err) {
              console.log(err);
              return res.send(err);
          }
          console.log('Note saved to database');
          res.redirect('/notes');
      });
  });

  app.delete('/notes', isLoggedIn, (req, res) => {
    Note.findOneAndDelete(
      { _id: req.body.noteId, userId: req.user._id },
      err => {
        if (err) return res.send(err);
        res.redirect('/profile');
      }
    );
  });

  app.post('/notes/delete', isLoggedIn, (req, res) => {
    Note.findOneAndDelete(
      { _id: req.body.noteId, userId: req.user._id },
      err => {
        if (err) return res.send(err)
        res.redirect('/notes')
      }
    )
  })

    // app.delete('/workouts/:id', isLoggedIn, (req, res) => {
    //   Workout.findOneAndDelete(
    //     { _id: req.body.workoutId, userId: req.user._id },
    //     err => {
    //       if (err) return res.send(err);
    //       res.redirect('/profile');
    //     }
    //   );
    // });

      // LOGOUT ==============================
      app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

  
    //old delete app req from savage auth
    // app.delete('/messages', (req, res) => {
    //   db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    //     if (err) return res.send(500, err)
    //     res.send('Message deleted!')
    //   })
    // })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}


    // app.put('/messages', (req, res) => {
    //   db.collection('messages')
    //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    //     $set: {
    //       thumbUp:req.body.thumbUp + 1
    //     }
    //   }, {
    //     sort: {_id: -1},
    //     upsert: true
    //   }, (err, result) => {
    //     if (err) return res.send(err)
    //     res.send(result)
    //   })
    // })

      
    // PROFILE SECTION =========================
    //commented out old savage auth app.get that db collection methods
    // app.get('/profile', isLoggedIn, function(req, res) {
    //     db.collection('messages').find().toArray((err, result) => {
    //       if (err) return console.log(err)
    //       res.render('profile.ejs', {
    //         user : req.user,
    //         messages: result
    //       })
    //     })
    // });

// message board routes ===============================================================

//commented out old post messages from savae auth
    // app.post('/messages', (req, res) => {
    //   db.collection('messages').save({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
    //     if (err) return console.log(err)
    //     console.log('saved to database')
    //     res.redirect('/profile')
    //   })
    // })