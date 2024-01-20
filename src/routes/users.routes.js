const Router = require('express');
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const {
  getUsers,
  addUser,
  deleteUser,
  updateUser,
  singleUser,
  login
} = require("../controllers/crud");

 const storage = new CloudinaryStorage({
   cloudinary: cloudinary,
   params: {
     folder: "DEV",
   },
 });

 const upload = multer({ storage: storage });
const routes = Router();

routes.get("/api/users", getUsers);
routes.post("/api/users", upload.single("avatarUrl"), addUser);
routes.delete("/api/users/:userId", deleteUser);
routes.put("/api/users/:userId", updateUser);
routes.get("/api/users/:userId", singleUser);
routes.post("/api/users/login", login);
module.exports = routes;