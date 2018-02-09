import { controller, get, post, required } from '../decorator/router'
import { resolve } from 'path'
import mongoose from 'mongoose'
import {
  openidAndSessionKey,
  WXBizDataCrypt
} from "../wechat-lib/mina"


const MinaUser = mongoose.model('MinaUser')
const Email = mongoose.model('Email')

@controller('/mina')
export class minaController {

  @get('/savelMsg')
  @required({ query: ['emailMsg', 'emailType', 'openid', 'nickname'] })
  async savelMsg (ctx, next) {
    const {emailMsg, emailType, openid, nickname} = ctx.query

    console.log(ctx.query)
    let email = new Email({
      emailMsg: emailMsg,
      emailType: emailType,
      openid: openid,
      nickname: nickname
    })
    await email.save()

    let user =  await MinaUser
      .findOne({
        openid: openid
      })
      .exec()

    user.emailArray.push(email._id)

    await user.save()


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

    if (!user){
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
    const{
      codem,
      avatarUrl,
      nickName,
    } = ctx.request.body

    // unionid 跨平台id
    try {
      const { openid, unionid } = await openidAndSessionKey(code)

      let user = await MinaUser.findOne({
        unionid
      }).exec()

      if(!user) {
        user = new User({
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
    } catch (e){
      ctx.body = {
        success: false,
        err: e
      }
    }
  }
}
