import Koa from "koa";
import { koaBody } from "koa-body";
import summary from "./summary.js";

console.log("Starting server...");

const app = new Koa();

app.use(koaBody());

app.use(summary.routes());

// Bootstrap the server
app.listen(process.env.PORT);
