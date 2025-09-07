// Imports
import express from "express";
import userRoutes from "./routes/userRoutes.mjs";
import postRoutes from "./routes/postRoutes.mjs";
import commentRoutes from "./routes/commentRoutes.mjs";

import error from "./middleware/errorHandling.mjs"
// Setups
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json({ extended: true }));


// Valid API Keys.
//let apiKeys = ["perscholas", "ps-example", "hJAsknw-L198sAJD-l3kasx"];

// New middleware to check for API keys!
// Note that if the key is not verified,
// we do not call next(); this is the end.
// This is why we attached the /api/ prefix
// to our routing at the beginning!
// app.use("/api/users", function (req, res, next) { // You can play with the endpoint(/api.users || /api/posts) to acctually to make sure that a specific endpoint is required a key to be able to actually read data
//   var key = req.query["api-key"];

//   // Check for the absence of a key.
//   if (!key) {
//     res.status(400);
//     return res.json({ error: "API Key Required" });
//   }

//   // Check for key validity.
//   if (apiKeys.indexOf(key) === -1) {
//     res.status(401);
//     return res.json({ error: "Invalid API Key" });
//   }

  // Valid key! Store it in req.key for route access.
  //req.key = key;
  //next();
//});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes)

// Adding some HATEOAS links.
app.get("/", (req, res) => {
  res.json({
    links: [
      {
        href: "/api/comments",
        rel: "api",
        type: "GET",
      },
      {
        href: "/api/comments",
        rel: "api",
        type: "POST",
      },
    ],
  });
});

// Adding some HATEOAS links.
app.get("/", (req, res) => {
  res.json({
    links: [
      {
        href: "api/users",
        rel: "users",
        type: "GET",
      },
      {
        href: "api/users",
        rel: "users",
        type: "POST",
      },
      {
        href: "api/users/:id",
        rel: "users",
        type: "PATCH"
      },
      {
        href: "api/users/:id",
        rel: "users",
        type: "DELETE"
      },
      {
        href: "api/posts",
        rel: "posts",
        type: "GET",
      },
      {
        href: "api/posts",
        rel: "posts",
        type: "POST",
      },
      {
        href: "api/posts/:id",
        rel: "posts",
        type: "PATCH",
      },{
        href: "api/posts/:id",
        rel: "posts",
        type: "PATCH"
      },
      {
        href: "api/posts/:id",
        rel: "posts",
        type: "DELETE"
      },
    ],
  });
});

// New logging middleware to help us keep track of
// requests during testing!
app.use((req, res, next) => {
  const time = new Date();

  console.log(
    `-----
${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`
  );
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Containing the data:");
    console.log(`${JSON.stringify(req.body)}`);
  }
  next();
});

// Global Err Handling
app.use(function (err, req, res, next) {
  res.status(err.status ||500).json({ msg:` 🩻 Error ${err.message} `});
});

// app.use((err,req,res,next)=>{
//   res.status(404).res.json({msg: "Resource not found"});
// });

app.use((req,res,next)=>{
  // res.status(404).res.json({msg: "Resource not found"});
  next(error(400,"Resource not found"))
});


// Listener
app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});