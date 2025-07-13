import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';
import { BaseGateway } from '../base/base-gateway.gateway';
import { WS_EVENT_NAME } from 'src/constants';
import { Socket } from 'socket.io';

export class SyncDataGateway extends BaseGateway {
  @SubscribeMessage(WS_EVENT_NAME.sync_data_device)
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() deviceId: string,
  ) {
    const room = `${WS_EVENT_NAME.sync_data_device}_${deviceId}`;
    this.logger.log(`Client join to room: `, room);
    return client.join(room);
  }

  async sendDataToDevice<T>(deviceId: string, data: T) {
    const room = `${WS_EVENT_NAME.sync_data_device}_${deviceId}`;
    this.logger.log(`Client send data to room: `, room);
    return this.server.to(room).emit(room, { success: true, data });
  }
}
