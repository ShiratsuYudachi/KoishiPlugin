import { Context } from "@koishijs/client";
import Page from "./page.vue";
import "virtual:uno.css";

export default (ctx: Context) => {
  ctx.page({
    name: "ChatLuna 向量数据库管理",
    path: "/chatluna-vector-database-management",
    component: Page,
  });
};
