import {prisma}from 'db/client'

Bun.serve({
    port: 8081,
    fetch(req, server) {
       if(server.upgrade(req)){
        return;
       } 
       return new Response("Upgrade failed", {status: 400});
    },
    websocket:{
        message(ws, message){
            prisma.user.create({
                data:{
                    name:Math.random().toString(36).substring(7),
                    email:`${Math.random().toString(36).substring(7)}@example.com`  

                }
            })
            ws.send(message);
        }
    }
} );

