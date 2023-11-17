import { PrismaClient } from "@prisma/client/edge";

let prisma: PrismaClient;

declare const global: NodeJS.Global & {
    prisma: PrismaClient;
  };

declare global {
    namespace NodeJS{
        interface Global{
            prisma: PrismaClient;
        }
    }
}

if(process.env.NODE_ENV==="production"){
    prisma = new PrismaClient();
} else{
    if(!global.prisma){
        global.prisma = new PrismaClient();
    }

    prisma = global.prisma
}

export default prisma;