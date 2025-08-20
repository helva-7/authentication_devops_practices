const express = require("express");
const router = express.Router();
const { authorize } = require("../middlewares/authorize");

// Flux routes
router.get("/", authorize("flux:read"), (req, res) => {
  res.json({ message: "user flux page" });
});

router.post("/", authorize("flux:write"), (req, res) => {
  res.json({ message: " manager flux page" });
});

module.exports = router;
