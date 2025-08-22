

const server = Bun.serve({
    routes: {
        "/api/status": () => {
            console.log("status");
            return new Response("STO BENE!")
        }
    }
})

console.log(`listening on ${server.url} on ${server.port}`);
