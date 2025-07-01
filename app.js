const express = require('express');
const app = express();
const connectDB = require('./config/mongoose'); 
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo');
connectDB(); 
const Note = require('./models/Note'); 
const User = require('./models/User');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');



app.use(session({
  secret: 'khatabook_secret_key', 
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/khatabookDB' }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } 
}));

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

function isLoggedIn(req, res, next) {
  if (req.session.userId) return next();
  res.redirect('/login');
}

//Register Route
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashed });
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login");
});

//login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.send("Invalid email");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.send("Invalid password");

  req.session.userId = user._id;
  res.redirect("/");
});

// Home route – list all notes
app.get("/", isLoggedIn, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.session.userId }).sort({ createdAt: -1 });
    res.render("index", {
      files: notes,
      session: req.session 
    });
  } catch (err) {
    res.send("Error fetching notes");
  }
});



// Create note page
app.get("/create", (req, res) => {
  res.render("create");
});

// Handle note creation
app.post("/createhisaab", async (req, res) => {
  try {
    const { title, content, password } = req.body;

    if (!title || !content) {
      return res.send("Title and content are required.");
    }

    let hashedPassword = null;
    if (password && password.trim() !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await Note.create({
      title,
      body: content,
      password: hashedPassword,
      userId: req.session.userId 
    });

    res.redirect("/");
  } catch (err) {
    console.error("Error creating note:", err.message);
    res.send("Error creating note");
  }
});

// View a specific note
app.get("/hisaab/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.send("Note not found");

  if (note.password) {
    return res.render("password", { id: note._id }); 
  }

  res.render("hisaab", {
    filedata: note.body,
    filename: note.title,
    id: note._id
  });
});

app.post("/verify-edit/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.send("Note not found");

  const isValid = await bcrypt.compare(req.body.password, note.password || "");
  if (!isValid) return res.send("❌ Incorrect password");

  res.render("edit", {
    filedata: note.body,
    filename: note.title,
    id: note._id
  });
});

app.post("/verify-password/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.send("Note not found");

  const match = await bcrypt.compare(req.body.password, note.password || "");
  if (!match) return res.send("Incorrect password");

  res.render("hisaab", {
    filedata: note.body,
    filename: note.title,
    id: note._id
  });
});

app.post("/verify-edit/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.send("Note not found");

  const isValid = await bcrypt.compare(req.body.password, note.password || "");
  if (!isValid) return res.send("Incorrect password");

  res.render("edit", {
    filedata: note.body,
    filename: note.title,
    id: note._id
  });
});

//shared hisaab route
app.get("/shared/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.send("Note not found");

    if (note.password) {
      return res.send("❌ This note is protected. Please remove the password before sharing.");
    }

    res.render("hisaab", {
      filedata: note.body,
      filename: note.title,
      id: note._id,
      session: req.session || null
    });
  } catch (err) {
    res.send("Error loading shared note");
  }
});


// Edit a specific note
app.get("/edit/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.send("Note not found");

    res.render("edit", {
  filedata: note.body,
  filename: note.title,
  id: note._id,
  password: note.password,
  session: req.session
});
  } catch (err) {
    res.send("Error loading note");
  }
});



// Handle update
app.post("/update/:id", async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      body: req.body.content
    };

    // ✅ If "remove password" is checked
    if (req.body.removePassword) {
      updateData.password = null;
    }
    // ✅ If a new password is provided
    else if (req.body.password && req.body.password.trim() !== "") {
      updateData.password = await bcrypt.hash(req.body.password, 10);
    }

    await Note.findByIdAndUpdate(req.params.id, updateData);
    res.redirect("/");
  } catch (err) {
    res.send("Error updating note");
  }
});


// Delete note
app.get("/delete/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    res.send("Error deleting note");
  }
});

//logout route
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});


app.listen(3000);
