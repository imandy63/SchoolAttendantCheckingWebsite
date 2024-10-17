import { credentials } from "@grpc/grpc-js";
import { TokenValidationServiceClient } from "../proto/token/token_grpc_pb";
import { TokenRequest } from "../proto/token/token_pb";
import { GRPCConfig } from "../config/config.grpc";

type validateType = {
  message: string;
  status: boolean;
};

const authURL = GRPCConfig.authURL;
if (!authURL) {
  throw new Error("GRPC Auth URL is missing");
}

const authClient = new TokenValidationServiceClient(
  authURL,
  credentials.createInsecure()
);

const validateTokenGRPC = async (token: string, userid: string) => {
  const tokenRequest = new TokenRequest();
  tokenRequest.setToken(token);
  tokenRequest.setUserid(userid);
  return new Promise<validateType>((resolve, reject) => {
    authClient.validateToken(tokenRequest, (err, response) => {
      if (err || !response || response === undefined) {
        reject("Service error");
      } else {
        const isValid = response.getIsvalid();
        const message = response.getMessage();
        resolve({ status: isValid, message: message });
      }
    });
  });
};

export { validateTokenGRPC };
