import {
  GatewayTimeoutException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RpcErrorPayload } from '@app/contracts';
import { firstValueFrom, TimeoutError } from 'rxjs';
import { timeout } from 'rxjs/operators';

const RPC_TIMEOUT_MS = Number(process.env.MICROSERVICE_TIMEOUT_MS ?? 5000);

function isRpcErrorPayload(error: unknown): error is RpcErrorPayload {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    typeof (error as { statusCode?: unknown }).statusCode === 'number' &&
    'message' in error &&
    'error' in error &&
    typeof (error as { error?: unknown }).error === 'string'
  );
}

function mapRpcError(error: RpcErrorPayload) {
  return new HttpException(
    {
      statusCode: error.statusCode,
      message: error.message,
      error: error.error,
    },
    error.statusCode,
  );
}

function extractRpcError(error: unknown): RpcErrorPayload | null {
  if (isRpcErrorPayload(error)) {
    return error;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    isRpcErrorPayload((error as { message?: unknown }).message)
  ) {
    return (error as { message: RpcErrorPayload }).message;
  }

  return null;
}

function extractErrorMessage(error: unknown) {
  if (typeof error === 'string') {
    return error;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message;
  }

  return 'Internal server error';
}

export async function sendRpc<TResult = any, TPayload = unknown>(
  client: ClientProxy,
  pattern: unknown,
  payload: TPayload,
) {
  try {
    return await firstValueFrom(
      client
        .send<TResult, TPayload>(pattern, payload)
        .pipe(timeout(RPC_TIMEOUT_MS)),
    );
  } catch (error) {
    if (error instanceof TimeoutError) {
      throw new GatewayTimeoutException('El microservicio no respondio a tiempo');
    }

    const rpcError = extractRpcError(error);
    if (rpcError) {
      throw mapRpcError(rpcError);
    }

    throw new InternalServerErrorException(extractErrorMessage(error));
  }
}
