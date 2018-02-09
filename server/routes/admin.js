import { controller, get, post, required } from '../decorator/router'
import { resolve } from 'path'
import mongoose from 'mongoose'


const AdminUser = mongoose.model('AdminUser')
const Email = mongoose.model('Email')

@controller('/admin')
export class adminController {

  @post('login')
  @required({ body: ['email', 'password']})
  async login (ctx, next) {
    const { email, password } = ctx.request.body
    let user
    let match = null

    try {
      user = await AdminUser.findOne({ email: email }).exec()
      console.log(user +"密码错误？")
      if (user) {
        match = await user.comparePassword(password, user.password)
      }
    } catch (e) {
      throw new Error(e)
    }

    if (match) {
      ctx.session.user = {
        _id: user._id,
        email: user.email,
        nickname: user.nickname,
        role: user.role
      }

      return (ctx.body = {
        success: true,
        data: {
          email: user.email,
          nickname: user.nickname
        }
      })

    }

    return (ctx.body = {
      success: false,
      err: '密码错误'
    })

  }

  @post('logout')
  async logout (ctx, next) {
    ctx.session = null

    ctx.body = {
      success: true
    }
  }

  @post('addUser')
  @required({ body: ['email', 'password', 'nickname'] })
  async addUser (ctx, next) {
    const userMsg = ctx.request.body

    let user = await AdminUser.findOne({
      email: userMsg.email
    })

    if(!user) {
      user = new AdminUser({
        email: userMsg.email,
        password: userMsg.password,
        nickname: userMsg.nickname
      })

      await user.save()
      ctx.body = {
        success: true
      }
    } else {
      ctx.body = {
        success: false,
        err: '邮箱已存在'
      }
    }
  }

  @get('userList')
  async fetchUserList (ctx, next) {
    let { limit = 50 } = ctx.query

    let List = await AdminUser
      .find({})
      .limit(Number(limit))
      .exec()

    console.log(List)
    ctx.body = {
      success: true,
      data: List
    }
  }

  @get('emailList')
  async fetchEmailList (ctx, next) {
    let { limit = 50 } = ctx.query

    let List = await Email
      .find({})
      .limit(Number(limit))
      .exec()

    ctx.body = {
      success: true,
      data: List
    }
  }
}
