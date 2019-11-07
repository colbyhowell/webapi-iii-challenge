const express = require("express");

const Users = require("../users/userDb");
const Posts = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
  Users.insert(req.body)
    .then(addedUser => {
      res.status(200)
        .json({ message: "User created", addedUser })
    })
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  Users.getUserPosts(req.user).then(res.status(200).json(res));
});

router.get("/", async (req, res) => {
  const userList = await Users.get();
  try {
    res.status(200).json(userList);
  } catch {
    res.status(500).json({ message: "The server did not return users" });
  }
});

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, async (req, res) => {
  const userPosts = await Users.getUserPosts(req.user.id);
  try {
    res.status(200).json(userPosts);
  } catch {
    res.status(500).json({ message: "This user's posts could not be found" });
  }
});

router.delete("/:id", validateUserId, (req, res) => {
  Users.remove(req.user.id).then({ message: "user deleted" })
});

router.put("/:id", validateUser, (req, res) => {
  const { id } = req.params
  Users.update(id, req.body)
    .then(changedUser => {
      res.status(200)
        .json({ message: "User updated", changedUser })
    })
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;
  Users.getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({ message: "Invalid User ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "exception", err });
    });
}

function validateUser(req, res, next) {
  const newUserData = req.body;
  if (!newUserData) {
    res.status(400).json({ message: "Missing user data" });
  } else if (!newUserData.name) {
    res.status(400).json({ message: "Missing name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  const newPostData = req.body;
  if (!newPostData) {
    res.status(400).json({ message: "Missing post data" });
  } if (!newPostData.name) {
    res.status(400).json({ message: "Missing text field" });
  } else {
    next();
  }
}

module.exports = router;
