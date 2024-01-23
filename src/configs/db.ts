import mongoose, { ConnectOptions } from 'mongoose';

export const connectDatabase = async () => {
  try {
    if (process.env.DB_CONNECTION_STRING) {
      await mongoose.connect(
        process.env.DB_CONNECTION_STRING,
        {} as ConnectOptions
      );
      console.log('DB connected!');
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
