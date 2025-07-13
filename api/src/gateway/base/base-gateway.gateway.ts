import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class BaseGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  public readonly logger = new Logger(BaseGateway.name);
  @WebSocketServer() server: Server;

  afterInit() {
    return this.logger.log('Websocket Initialized');
  }

  handleConnection(client: Socket) {
    return this.logger.log(`Client ${client.id} is connected`);
  }

  handleDisconnect(client: Socket) {
    return this.logger.warn(`Client ${client.id} is disconnected`);
  }
}
