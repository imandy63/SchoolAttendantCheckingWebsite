// package: 
// file: token.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class TokenRequest extends jspb.Message { 
    getUserid(): string;
    setUserid(value: string): TokenRequest;
    getToken(): string;
    setToken(value: string): TokenRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TokenRequest.AsObject;
    static toObject(includeInstance: boolean, msg: TokenRequest): TokenRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TokenRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TokenRequest;
    static deserializeBinaryFromReader(message: TokenRequest, reader: jspb.BinaryReader): TokenRequest;
}

export namespace TokenRequest {
    export type AsObject = {
        userid: string,
        token: string,
    }
}

export class TokenResponse extends jspb.Message { 
    getIsvalid(): boolean;
    setIsvalid(value: boolean): TokenResponse;
    getMessage(): string;
    setMessage(value: string): TokenResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TokenResponse.AsObject;
    static toObject(includeInstance: boolean, msg: TokenResponse): TokenResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TokenResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TokenResponse;
    static deserializeBinaryFromReader(message: TokenResponse, reader: jspb.BinaryReader): TokenResponse;
}

export namespace TokenResponse {
    export type AsObject = {
        isvalid: boolean,
        message: string,
    }
}
