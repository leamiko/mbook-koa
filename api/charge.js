import { Charge } from '../models'

export default function(router) {
  router.post('/api/charge', async (ctx, next) => {
    let { pay_money, yuebi_num, benefit, limit_start_time, limit_end_time } = ctx.request.body
    if (pay_money) {
      if (yuebi_num) {
        if (benefit) {
          benefit = parseInt(benefit)
          if (benefit === 0) {
            // do nothing
          } else if (benefit === 1) {
            // 首充福利
            // do nothing 折扣体现在pay_money和yuebi_num上
          } else if (benefit === 2) {
            // 限时免费
            if (limit_start_time && limit_end_time) {
              limit_start_time = new Date(limit_start_time)
              limit_end_time = new Date(limit_end_time)
            } else {
              ctx.body = { ok: false, msg: '请指定限时优惠的起始时间和结束时间' }
              await next()
              return
            }
          }
        } else {
          ctx.body = { ok: false, msg: '请指定充值商品类型0,1，2' }
          await next()
          return
        }
        let thisCharge = await Charge.create({
          pay_money: pay_money,
          yuebi_num: yuebi_num,
          benefit: benefit,
          limit_start_time: limit_start_time || null,
          limit_end_time: limit_end_time || null,
          create_time: new Date()
        })
        if (thisCharge) {
          ctx.body = { ok: true, msg: '添加充值商品成功', data: thisCharge }
        } else {
          ctx.body = { ok: false, msg: '添加充值商品失败', data: thisCharge }
        }
      } else {
        ctx.body = { ok: false, msg: '缺乏yuebi_num参数' }
      }
    } else {
      ctx.body = { ok: false, msg: '缺乏pay_money参数' }
    }
  })

  router.get('/api/charge', async (ctx, next) => {
    let result = []
    let thisCharge = await Charge.find().sort({ pay_money: 1 })
    thisCharge &&
      thisCharge.forEach(item => {
        result.push({ id: item._id, prise: item.pay_money, yuebi: item.yuebi_num })
      })
    ctx.body = { ok: true, msg: '获取充值商品成功', list: result }
  })
}