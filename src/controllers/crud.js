const Users = require("../models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


const getUsers = async (req, res) => {
  try {
    const users = await Users.find();

    if (users.length <= 0) {
      return res.status(200).json({
        message: "No users found",
        data: users,
      });
    } else {
      return res.status(200).json({
        message: "Users found",
        data: users,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const addUser = async (req, res) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    const user = new Users({
      username: req.body.username,
      email: req.body.email,
      age: req.body.age,
      favFood: req.body.favFood,
      avatarUrl: req.file.path,
      password: hashedPassword,
    });

    if (!req.body.username || !req.body.favFood || !req.body.favFood) {
      return res.status(403).json({
        message: "Username or age is required",
      });
    }
    await user.save();
    return res.status(200).json({
      messager: "user added successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const isuserExist = await Users.findById(userId);

    if (!isuserExist)
      return res.status(403).json({
        message: "User not found",
      });

    await Users.findByIdAndDelete(userId);

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.userId;
    const { username, age, favFood } = req.body;

    const updatedUser = await Users.findByIdAndUpdate(
      id,
      { username, age, favFood },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User updated successfully",
      updatedUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const singleUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    } else {
      return res.status(200).json({
        message: "User found",
        data: user,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  // Check if username and password is provided
  if (!email || !password) {
    return res.status(400).json({
      message: "email or Password not present",
    });
  }
    
   try {
     const user = await Users.findOne({ email, password });
     
     if (!user) {
       res.status(401).json({
         message: "Login not successful",
         error: "User not found",
       });
     } else {
       const token = jwt.sign(
         { _id: user?._id, email: user?.email },
         process.env.JWT_SECRET,
         {
           expiresIn: "1d",
         }
       );
       res.status(200).json({
         message: "Login successful",
         user,
         token
       });
     }
   } catch (error) {
     res.status(400).json({
       message: "An error occurred",
       error: error.message,
     });
   }
};

module.exports = {
  addUser,
  getUsers,
  deleteUser,
  updateUser,
  singleUser,
  login,
};
