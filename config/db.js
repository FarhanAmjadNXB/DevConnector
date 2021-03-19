const mongoose = require('mongoose');
const config = require('Config');

const db = config.get('mongoURI', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log('Database connected ...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
