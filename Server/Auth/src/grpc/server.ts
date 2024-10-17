import {
  Server,
  ServerCredentials,
  ServerUnaryCall,
  sendUnaryData,
} from "@grpc/grpc-js";
import { TokenValidationServiceService } from "../proto/token_grpc_pb";
import { TokenRequest, TokenResponse } from "../proto/token_pb";
import { grpcVerification } from "../services/access.grpt.service";

const grpcServer = new Server();

grpcServer.addService(TokenValidationServiceService, {
  validateToken: async (
    call: ServerUnaryCall<TokenRequest, TokenResponse>,
    callback: sendUnaryData<TokenResponse>
  ) => {
    const request: TokenRequest = call.request;

    const { userid, token } = request.toObject();
    const { isValid, message } = await grpcVerification({
      userId: userid,
      accessToken: token,
    });
    const response = new TokenResponse();
    response.setIsvalid(isValid);
    response.setMessage(message);
    callback(null, response);
  },
});

const startGRPCAuthService = () => {
  const grpcAuthPort = process.env.GRPC_PORT;

  if (!grpcAuthPort) {
    throw new Error("GRPC port is missing");
  }

  grpcServer.bindAsync(
    `localhost:${grpcAuthPort}`,
    ServerCredentials.createInsecure(),
    () => {
      console.log(`GRPC Auth Service is running on port ${grpcAuthPort}`);
    }
  );
};

export { startGRPCAuthService };
