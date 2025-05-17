const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/dbConfig');
const { Server } = require('socket.io');
const Battery = require('./models/Battery');
const cookieParser = require('cookie-parser');
const Device = require('./models/Device');
const events = require('events');
const authController = require('./controllers/authController');

console.log("Loading environment variables...");
dotenv.config();
console.log("Environment variables loaded.");

console.log("Connecting to database...");
connectDB();
console.log("Database connection initiated.");

const app = express();
const server = http.createServer(app);
console.log("HTTP server created.");

const io = new Server(server, {
  cors: {
    origin: "*",
  }
});
console.log("Socket.io server created with CORS configuration.");

// Middleware Setup
console.log("Setting up middleware...");
app.use(helmet());
console.log("Helmet middleware added.");
app.use(cookieParser());
console.log("CookieParser middleware added.");
app.use(express.json());
console.log("express.json middleware added.");
app.use(bodyParser.urlencoded({ extended: false }));
console.log("bodyParser middleware added.");
app.use(express.static(path.join(__dirname, 'public')));
console.log("Static files served from 'public'.");
app.set('views', path.join(__dirname, 'views'));
console.log("Views directory set.");
app.set('view engine', 'ejs');
console.log("View engine set to ejs.");
app.use(cors());
console.log("CORS middleware added.");

// API Routes Setup
console.log("Setting up API routes...");
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const detail = require('./routes/detail');
const statusRoutes = require('./routes/StatusRoutes');
const simRoutes = require('./routes/simRoutes');
const authRouter = require('./routes/authRouter');
const allRoute = require('./routes/allformRoutes');

console.log("Initializing admin...");
authController.initializeAdmin();
console.log("Admin initialized.");

app.use('/api/admin', adminRoutes);
console.log("Admin routes added.");
app.use('/api/notification', notificationRoutes);
console.log("Notification routes added.");
app.use('/api/device', deviceRoutes);
console.log("Device routes added.");
app.use('/api/data', detail);
console.log("Detail routes added.");
app.use('/api/status', statusRoutes);
console.log("Status routes added.");
app.use('/api/sim', simRoutes);
console.log("SIM routes added.");
app.use('/api/auth', authRouter);
console.log("Auth routes added.");
app.use('/api/all', allRoute);
console.log("All form routes added.");

// Increase Global Max Listeners
console.log("Setting global max listeners to 20.");
events.defaultMaxListeners = 20;

// Socket.io Connection Handling
console.log("Setting up Socket.io connections...");
io.on("connection", (socket) => {
  console.log(`Socket.io: Client connected with id: ${socket.id}`);

  socket.on("newDevice", (newDevice) => {
    console.log("Socket.io: New Device Added:", newDevice);
    io.emit("newDevice", newDevice);
  });

  socket.on("disconnect", () => {
    console.log(`Socket.io: Client disconnected with id: ${socket.id}`);
    socket.removeAllListeners();
  });
});
console.log("Socket.io connections set up.");

// Function to Update Battery Status
const updateBatteryStatus = async () => {
  try {
    console.log("Fetching battery statuses...");
    const batteryStatuses = await Battery.find({}, 'uniqueid batteryLevel connectivity timestamp');
    console.log("Battery statuses fetched:", batteryStatuses.length);
    const devices = await Device.find({}, 'brand _id');
    console.log("Devices fetched:", devices.length);

    const devicesWithBattery = devices.map(device => {
      const battery = batteryStatuses.find(b =>
        b.uniqueid && b.uniqueid.toString() === device._id.toString()
      );
      return {
        _id: device._id,
        brand: device.brand,
        uniqueid: device._id,
        batteryLevel: battery ? battery.batteryLevel : 'N/A',
        connectivity: battery ? battery.connectivity : 'Offline'
      };
    });

    console.log("Emitting batteryUpdate for", devicesWithBattery.length, "devices.");
    io.emit("batteryUpdate", devicesWithBattery);
  } catch (error) {
    console.error("Error updating battery status:", error);
  }
};

// Watch Battery Status Changes
console.log("Watching battery status changes...");
let batteryUpdateTimeout;
const batteryChangeStream = Battery.watch();
batteryChangeStream.setMaxListeners(20);
batteryChangeStream.on("change", () => {
  console.log("Battery change detected.");
  clearTimeout(batteryUpdateTimeout);
  batteryUpdateTimeout = setTimeout(() => {
    updateBatteryStatus();
  }, 5000);
});

// Check Offline Devices Periodically
const checkOfflineDevices = async () => {
  try {
    const offlineThreshold = 15000;
    const currentTime = new Date();
    const cutoffTime = new Date(currentTime - offlineThreshold);

    console.log("Checking for offline devices...");
    const offlineDevices = await Battery.find({
      $or: [
        { connectivity: "Online", timestamp: { $lt: cutoffTime } },
        { connectivity: "Offline", timestamp: { $lt: cutoffTime } }
      ]
    });

    console.log("Found", offlineDevices.length, "offline devices.");
    if (offlineDevices.length > 0) {
      await Battery.updateMany(
        { uniqueid: { $in: offlineDevices.map(d => d.uniqueid) } },
        { $set: { connectivity: "Offline" } }
      );
      console.log("Updated offline devices. Emitting batteryUpdate.");
      io.emit("batteryUpdate", offlineDevices);
    }
  } catch (error) {
    console.error("Error updating offline devices:", error);
  }
};

setInterval(checkOfflineDevices, 10000);
console.log("Offline devices check set at 10s interval.");

// Start the Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
