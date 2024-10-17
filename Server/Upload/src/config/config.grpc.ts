import * as dotenv from "dotenv";
dotenv.config();

const GRPCConfig = {
  authURL: process.env.AUTH_GRPC_URL,
};

export { GRPCConfig };
