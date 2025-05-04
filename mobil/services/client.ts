// services/mqtt.ts
import { Client, Message } from 'react-native-paho-mqtt';

// Tip tanımlamaları
interface MQTTConfig {
  uri: string;
  clientId?: string;
}

interface ConnectionLostEvent {
  errorCode: number;
  errorMessage: string;
}

interface MQTTMessage extends Message {
  payloadString: string;
}

class MQTTService {
  private static instance: MQTTService;
  private client: Client | null = null;
  private messageHandlers: ((message: MQTTMessage) => void)[] = [];

  private constructor() {}

  public static getInstance(): MQTTService {
    if (!MQTTService.instance) {
      MQTTService.instance = new MQTTService();
    }
    return MQTTService.instance;
  }

  public async initialize(config: MQTTConfig): Promise<void> {
    if (this.client) {
      console.warn('MQTT client already initialized');
      return;
    }

    this.client = new Client({
      uri: config.uri,
      clientId: config.clientId || `expo-client-${Math.random().toString(16).substr(2, 8)}`,
    });

    this.setupEventListeners();
    
    try {
      await this.client.connect();
      console.log('MQTT connected successfully');
    } catch (error) {
      console.error('MQTT connection failed:', error);
      throw error;
    }
  }

  private setupEventListeners(): void {
    if (!this.client) return;

    this.client.on('connectionLost', (response: ConnectionLostEvent) => {
      console.log('MQTT connection lost:', response.errorMessage);
      // Yeniden bağlantı mantığı eklenebilir
    });

    this.client.on('messageReceived', (message: MQTTMessage) => {
      this.messageHandlers.forEach(handler => handler(message));
    });
  }

  public subscribe(topic: string): void {
    if (!this.client) {
      throw new Error('MQTT client not initialized');
    }

    this.client.subscribe(topic)
      .then(() => console.log(`Subscribed to ${topic}`))
      .catch(error => console.error('Subscription failed:', error));
  }

  public unsubscribe(topic: string): void {
    if (!this.client) {
      throw new Error('MQTT client not initialized');
    }

    this.client.unsubscribe(topic)
      .then(() => console.log(`Unsubscribed from ${topic}`))
      .catch(error => console.error('Unsubscription failed:', error));
  }

  public addMessageHandler(handler: (message: MQTTMessage) => void): void {
    this.messageHandlers.push(handler);
  }

  public removeMessageHandler(handler: (message: MQTTMessage) => void): void {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }

  public async disconnect(): Promise<void> {
    if (!this.client) return;
    
    try {
      await this.client.disconnect();
      this.client = null;
      console.log('MQTT disconnected');
    } catch (error) {
      console.error('Disconnection failed:', error);
      throw error;
    }
  }
}

export default MQTTService.getInstance();