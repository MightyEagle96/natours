const mongoose = require('mongoose');
const dotenv = require('dotenv');

// process.on('uncaughtException', (err) => {
//   console.log('UNCAUGHT EXCEPTION 🦅. Shutting down...');
//   console.log(err.name, err.message);
//   //to shut down the application in case of a DB problem
//   process.exit(1); //0 stands for success and 1 for uncalled exception
// });

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
const DBLocal = process.env.DATABASE_LOCAL;
mongoose
  .connect(
    //process.env.DATABASE_LOCAL, {
    DBLocal,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('DB connection successful'));
// .catch(() => console.log(`There's an error connecting to the database`));

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  //to shut down the application in case of a DB problem
  console.log('UNHANDLER REJECTION 🦅. Shutting down...');
  server.close(() => {
    process.exit(1); //0 stands for success and 1 for uncalled exception
  });
});
