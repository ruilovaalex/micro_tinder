import { RpcException } from '@nestjs/microservices';

export type RpcErrorPayload = {
  statusCode: number;
  message: string | string[];
  error: string;
};

export function rpcError(
  statusCode: number,
  message: string | string[],
  error: string,
) {
  return new RpcException({
    statusCode,
    message,
    error,
  });
}
