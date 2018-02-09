import { controller, get, post, required } from '../decorator/router'
import { resolve } from 'path'
import mongoose from 'mongoose'

const Admin = mongoose.model('Admin')
const Problem = mongoose.model('Problem')
const ProblemReply = mongoose.model('ProblemReply')

@controller('/admin')
export class adminController {

  /* 问题回复 */
  @post('addReply')
  @required({ body: ['_id', 'reply'] })
  async addReply (ctx, next) {
    const replyMsg = ctx.request.body

    /* 保存回复 */
    let user = await Admin.findOne({
      email: replyMsg.email
    })

    const reply = new ProblemReply({
      adminUser: user._id,
      problem: replyMsg._id,
      reply: replyMsg.reply
    })
    /* 将reply._id 添加进Problem.reply */
    let problem = await Problem.findOne({
      _id: replyMsg._id
    })

    problem.reply = reply._id
    problem.solve = true

    await problem.save()
    await reply.save()
    ctx.body = {
      success: true
    }
  }

  /* 添加问题审核管理员 */
  @post('addUser')
  @required({ body: ['email', 'password', 'nickname'] })
  async addUser (ctx, next) {
    const userMsg = ctx.request.body

    /* 邮箱为依据 */
    let user = await Admin.findOne({
      email: userMsg.email
    })

    if (!user) {
      user = new Admin({
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

  /* 管理员集合 */
  @get('userList')
  async fetchUserList (ctx, next) {
    let { limit = 50 } = ctx.query

    let List = await Admin
      .find({})
      .limit(Number(limit))
      .exec()

    ctx.body = {
      success: true,
      data: List
    }
  }

  /* 问题集合 */
  @get('problemList')
  async fetchProblems (ctx, next) {
    let { limit = 50 } = ctx.query

    let List = await Problem
      .find({})
      .populate('user')
      .limit(Number(limit))
      .exec()

    ctx.body = {
      success: true,
      data: List
    }
  }

  /* 登录 */
  @post('login')
  @required({ body: ['email', 'password']})
  async login (ctx, next) {
    const { email, password } = ctx.request.body
    let user
    let match = null

    try {
      user = await Admin.findOne({ email: email }).exec()
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

  /* 登出 */
  @post('logout')
  async logout (ctx, next) {
    ctx.session = null

    ctx.body = {
      success: true
    }
  }
}
