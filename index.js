import Koa from "koa";
import { koaBody } from "koa-body";
import summary from "./summary.js";

const app = new Koa();

app.use(koaBody());

app.use(summary.routes());

// Bootstrap the server
app.listen("0.0.0.0:$PORT");
