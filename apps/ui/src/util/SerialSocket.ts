export class SerialSocket {
  stream: WebSocket;
  sendBuffer: string[] = [];
  receiveBuffer: string[] = [];
  baudRate: number;
  transmitting: boolean = false;
  receiving: boolean = false;

  constructor({url, baudRate = 9600}: {url: string; baudRate?: number}) {
    this.stream = new WebSocket(url);
    this.baudRate = baudRate;
    this.stream.onmessage = (event) => {
      this.receiveBuffer.push(...event.data.split(''));
      if (!this.receiving) {
        this.handleReceive();
      }
    }
  }

  handleTransmit() {
    if (this.sendBuffer.length === 0) {
      if (this.transmitting) {
        this.onTransmitEnd();
      }
      this.transmitting = false;
      return;
    }
    if (!this.transmitting) {
      this.onTransmitStart();
    }
    this.transmitting = true;
    const data = this.sendBuffer.shift();
    if (!data) {
      if (this.transmitting) {
        this.onTransmitEnd();
      }
      this.transmitting = false;
      return;
    }
    // this.onTransmit();
    this.stream.send(data);

    setTimeout(() => {
      this.handleTransmit();
    }, 1000 / (this.baudRate / 8));
  }

  handleReceive() {
    if (this.receiveBuffer.length === 0) {
      if (this.receiving) {
        this.onReceiveEnd();
      }
      this.receiving = false;
      return;
    }
    if (!this.receiving) {
      this.onReceiveStart();
    }
    this.receiving = true;
    const data = this.receiveBuffer.shift();
    if (!data) {
      if (this.receiving) {
        this.onReceiveEnd();
      }
      this.receiving = false;
      return;
    }
    // this.onReceive();
    this.onData(data);

    setTimeout(() => {
      this.handleReceive();
    }, 1000 / (this.baudRate / 8));
  }

  send(data: string) {
    this.sendBuffer.push(...data.split(''));
    if (!this.transmitting) {
      this.handleTransmit();
    }
  }

  // @ts-ignore
  onData(data: string) {}
  onTransmit() {}
  onReceive() {}

  onTransmitStart() {}
  onTransmitEnd() {}
  onReceiveStart() {}
  onReceiveEnd() {}

  close() {
    this.stream.close();
  }
}
