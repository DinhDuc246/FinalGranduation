const mongoose = require("mongoose");

const connect = async (req, res) => {
  try {
    await mongoose.connect(
      `mongodb+srv://dinhduc2406:qwerty.123456@cluster0.loswnob.mongodb.net/`
    );
    console.log("Connect database successfully!");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connect;
