import { Context } from 'koishi'
import {} from '@koishijs/plugin-console'
import { resolve } from 'path'

export const name = 'chatluna-vector-store-management'

export function apply(ctx: Context) {
  ctx.inject(['console'], (ctx) => {
    ctx.console.addEntry({
      dev: resolve(__dirname, '../client/index.ts'),
      prod: resolve(__dirname, '../dist'),
    })
  })
}
