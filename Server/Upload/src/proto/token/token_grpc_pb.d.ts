// package: 
// file: token.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as token_pb from "./token_pb";

interface ITokenValidationServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    validateToken: ITokenValidationServiceService_IvalidateToken;
}

interface ITokenValidationServiceService_IvalidateToken extends grpc.MethodDefinition<token_pb.TokenRequest, token_pb.TokenResponse> {
    path: "/TokenValidationService/validateToken";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<token_pb.TokenRequest>;
    requestDeserialize: grpc.deserialize<token_pb.TokenRequest>;
    responseSerialize: grpc.serialize<token_pb.TokenResponse>;
    responseDeserialize: grpc.deserialize<token_pb.TokenResponse>;
}

export const TokenValidationServiceService: ITokenValidationServiceService;

export interface ITokenValidationServiceServer extends grpc.UntypedServiceImplementation {
    validateToken: grpc.handleUnaryCall<token_pb.TokenRequest, token_pb.TokenResponse>;
}

export interface ITokenValidationServiceClient {
    validateToken(request: token_pb.TokenRequest, callback: (error: grpc.ServiceError | null, response: token_pb.TokenResponse) => void): grpc.ClientUnaryCall;
    validateToken(request: token_pb.TokenRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: token_pb.TokenResponse) => void): grpc.ClientUnaryCall;
    validateToken(request: token_pb.TokenRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: token_pb.TokenResponse) => void): grpc.ClientUnaryCall;
}

export class TokenValidationServiceClient extends grpc.Client implements ITokenValidationServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public validateToken(request: token_pb.TokenRequest, callback: (error: grpc.ServiceError | null, response: token_pb.TokenResponse) => void): grpc.ClientUnaryCall;
    public validateToken(request: token_pb.TokenRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: token_pb.TokenResponse) => void): grpc.ClientUnaryCall;
    public validateToken(request: token_pb.TokenRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: token_pb.TokenResponse) => void): grpc.ClientUnaryCall;
}
