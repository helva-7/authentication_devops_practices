const express = require("express");
const router = express.Router();
const { authorize } = require("../middlewares/authorize");

router.get("/", authorize("dashboard:read"), (req, res) => {
  res.json({ message: "Welcome to the Admin Dashboard" });
});

module.exports = router;
