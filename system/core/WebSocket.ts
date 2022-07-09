import { Server } from "socket.io";

/**
 * Websocket class. This class is used to create a websocket server top of socket.io
 * @class WebSocket
 */
export class WebSocket {
  /**
   * Instance of socket.io server
   * @type {Server}
   */
  public static io(): Server {
    return global.io;
  }
}
