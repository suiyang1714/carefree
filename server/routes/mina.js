import { controller, get, post, required } from '../decorator/router'
import { resolve } from 'path'
import mongoose from 'mongoose'
import {
  openidAndSessionKey,
  WXBizDataCrypt
} from "../wechat-lib/mina"


const MinaUser = mongoose.model('MinaUser')
const Problem = mongoose.model('Problem')
const ProblemReply = mongoose.model('ProblemReply')

@controller('/mina')
export class minaController {

  /* 用户是否满意 */
  @get('isSatisfied')
  @required({query: ['_id'] })
  async isSatisfied (ctx, next ) {
    const { _id, satisfaction } = ctx.query
    let reply = await Problem
      .findOne({ _id: _id})
      .exec()

    reply.satisfaction = satisfaction
    reply.save()

    ctx.body = {
      success: true
    }
  }

  /* 判断是否有回信 */
  @get('isReply')
  @required({query: ['_id'] })
  async isReply (ctx, next) {
    const { _id } = ctx.query

    let reply = await Problem
      .find({ user: _id, solve: true})
      .populate({
        path: 'reply'
      })
      .exec()
    const array = reply
    array.forEach(function (item) {
      if (item.solve && item.reply.isUserAccess == false) {
        return ctx.body = {
          success: true,
          data: reply
        }
      }
    })
  }

  @get('poseProblem')
  @required({ query: ['problem', 'problemType', 'openid'] })
  async poseProblem (ctx, next) {
    const { problem, problemType, openid } = ctx.query

    /* 通过 openid 读取 user 信息 */
    let user = await MinaUser
      .findOne({
        openid: openid
      })
      .exec()

    let aProblem = new Problem({
      problem: problem,
      problemType: problemType,
      openid: openid,
      user: user._id
    })

    await aProblem.save()

    ctx.body = {
      success: true
    }
  }

  @get('codeAndSessionKey')
  @required({ query: ['code'] })
  async getCodeAndSessionKey (ctx, next) {
    const {code} = ctx.query
    let res = await openidAndSessionKey(code)

    ctx.body = {
      success: true,
      data: res
    }
  }
  @get('user')
  @required({ query: ['code', 'encryptedData', 'iv'] })
  async getUser (ctx, next) {
    const { code , encryptedData, iv } = ctx.query
    const minaUser = await openidAndSessionKey(code)
    console.log(minaUser)

    let user = await MinaUser.findOne({
      openid: minaUser.openId
    }).exec()

    if (!user) {
      let pc = new WXBizDataCrypt(minaUser.session_key)

      let data = pc.decryptData(encryptedData, iv)

      console.log(data)
      try {
        user = await MinaUser.findOne({
          openid: data.openId
        })

        if (!user) {
          let _userData = data
          user = new MinaUser({
            avatarUrl: _userData.avatarUrl,
            nickname: _userData.nickName,
            unionId: _userData.unionid,
            openid: _userData.openId,
            gender: _userData.gender,
            country: _userData.country,
            province: _userData.province,
            city: _userData.city
          })

          await user.save()
        }
      } catch (e) {
        ctx.throw(501, e)
      }
    }
    ctx.body = {
      success: true,
      data: user
    }
  }

  @post('login')
  @required({ body: ['code', 'avatarUrl', 'nickName'] })
  async login (ctx, next) {

    const {
      code,
      avatarUrl,
      nickName
    } = ctx.request.body

    // unionid 跨平台id
    try {
      const { openid, unionid } = await openidAndSessionKey(code)

      let user = await MinaUser.findOne({
        unionid
      }).exec()

      if (!user) {
        user = new User ({
          openid: [openid],
          nickname: nickName,
          unionid,
          avatarUrl
        })

        user = await user.save()
      } else {
        user.avatarUrl = avatarUrl
        user.nickname = nickName
        user = await user.save()
      }

      ctx.body = {
        success: true,
        data: {
          nickName: nickName,
          avatarUrl: avatarUrl
        }
      }
    } catch (e) {
      ctx.body = {
        success: false,
        err: e
      }
    }
  }
}
