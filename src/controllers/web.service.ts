import {Server, ServerWebSocket } from "bun";

class WebService {
    port: number;
    onMessage: (message: string) => void;
    private server: Server;

    constructor(port: number) {
        this.port = port;
    }

    start() {
        const server =  Bun.serve({
            port: this.port,
            fetch(req) {
                console.log("Rceived connection request...")
                console.log(req);
                if (server.upgrade(req)) {
                    return;
                }
                return new Response("WebSocket server running", { status: 200 });
            },
            websocket: {
                async message(ws: ServerWebSocket, message: string): Promise<void> {
                    console.log(`RECEIVED MESSAGE! ${message}`);
                    ws.sendText(`CIAO! ${message}`);
                }
            }
        })
        this.server = server;
        return server;
    }

}

