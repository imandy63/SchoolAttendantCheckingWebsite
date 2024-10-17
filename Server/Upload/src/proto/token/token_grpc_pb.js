// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var token_pb = require('./token_pb.js');

function serialize_TokenRequest(arg) {
  if (!(arg instanceof token_pb.TokenRequest)) {
    throw new Error('Expected argument of type TokenRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TokenRequest(buffer_arg) {
  return token_pb.TokenRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_TokenResponse(arg) {
  if (!(arg instanceof token_pb.TokenResponse)) {
    throw new Error('Expected argument of type TokenResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TokenResponse(buffer_arg) {
  return token_pb.TokenResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var TokenValidationServiceService = exports.TokenValidationServiceService = {
  validateToken: {
    path: '/TokenValidationService/validateToken',
    requestStream: false,
    responseStream: false,
    requestType: token_pb.TokenRequest,
    responseType: token_pb.TokenResponse,
    requestSerialize: serialize_TokenRequest,
    requestDeserialize: deserialize_TokenRequest,
    responseSerialize: serialize_TokenResponse,
    responseDeserialize: deserialize_TokenResponse,
  },
};

exports.TokenValidationServiceClient = grpc.makeGenericClientConstructor(TokenValidationServiceService);
