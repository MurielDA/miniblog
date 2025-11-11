import app from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import { connect } from "http2";

const PORT = parseInt(env.PORT, 10) || 3000;

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`Environment: ${env.NODE_ENV}`);

    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

