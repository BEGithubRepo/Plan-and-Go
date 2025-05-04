declare module 'react-native-paho-mqtt' {
    export class Client {
      constructor(config: { uri: string; clientId: string });
      connect(): Promise<void>;
      disconnect(): Promise<void>;
      subscribe(topic: string): Promise<void>;
      unsubscribe(topic: string): Promise<void>;
      on(event: 'connectionLost', callback: (response: { errorCode: number; errorMessage: string }) => void): void;
      on(event: 'messageReceived', callback: (message: Message) => void): void;
    }
  
    export class Message {
      payloadString: string;
      destinationName: string;
      duplicate: boolean;
      retained: boolean;
      qos: number;
    }
  }