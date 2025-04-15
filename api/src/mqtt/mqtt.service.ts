import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { connect, MqttClient } from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private client: MqttClient;

  constructor() {
    this.client = connect(`mqtt://localhost`, {
      port: 1883,
      clientId: `nestjs_${Math.random().toString(16).slice(3)}`,
    });

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
    });

    this.client.on('error', (err) => {
      console.error('MQTT error:', err);
    });
  }

  async onModuleInit() {
    // Subscribe vào topic khi module khởi tạo
    this.client.subscribe('absolutech/delete-user', (err) => {
      if (!err) {
        console.log('Subscribed to absolutech/delete-user');
      }
    });
    // Xử lý tin nhắn nhận được
    this.client.on('message', (topic, message) => {
      console.log(`Received message on ${topic}: ${message.toString()}`);
    });
  }

  async onModuleDestroy() {
    // Ngắt kết nối khi module bị hủy
    this.client.end();
  }

  // Gửi tin nhắn tới topic
  publish(topic: string, message: string) {
    this.client.publish(topic, message, { qos: 0 }, (err) => {
      if (err) {
        console.error('Publish error:', err);
      } else {
        console.log(`Published to ${topic}: ${message}`);
      }
    });
  }
}
