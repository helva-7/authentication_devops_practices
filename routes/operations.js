const express = require("express");
const router = express.Router();
const { authorize } = require("../middlewares/authorize");

// Operations routes
router.get("/", authorize("operations:read"), (req, res) => {
  res.json({ message: "user page" });
});

router.post("/", authorize("operations:write"), (req, res) => {
  res.json({ message: "manager operation page" });
});

module.exports = router;
