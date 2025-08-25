// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const dashboardRoutes = require("./routes/dashboard");
const fluxRoutes = require("./routes/flux");
const operationsRoutes = require("./routes/operations");
const adminRoutes = require('./routes/admin');
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/flux", fluxRoutes);
app.use("/operations", operationsRoutes);
app.use('/api/admin', adminRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
