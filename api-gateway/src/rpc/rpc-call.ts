import { GatewayTimeoutException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, TimeoutError } from 'rxjs';
import { timeout } from 'rxjs/operators';

const RPC_TIMEOUT_MS = Number(process.env.MICROSERVICE_TIMEOUT_MS ?? 5000);

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

    throw error;
  }
}
