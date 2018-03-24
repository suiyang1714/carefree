import { controller, get, post, required, del } from '../decorator/router'
import { resolve } from 'path'
import mongoose from 'mongoose'
import axios from 'axios'

const Admin = mongoose.model('Admin')
const Problem = mongoose.model('Problem')
const ProblemReply = mongoose.model('ProblemReply')

@controller('/admin')
export class adminController {

  /* 删除邮件回复 */
  @get('deleteReply')
  async deleteReply (ctx, next) {
    const _id = ctx.query._id
    if (!_id) return (ctx.body = { success: false, err: '_id is required' })

    let reply = await ProblemReply
      .findOne({_id: _id})
      .exec()
    let problem = await Problem
      .findOne({_id: reply.problem})
      .exec()

    if (problem) {
      await ProblemReply.remove({_id: _id})
      problem.solve = false
      problem.reply = ''
      await problem.save()

      ctx.body = {
        success: true
      }
    }
  }

  /* 回复列表 */
  @get('replyList')
  async fetchReply ( ctx, next ) {
    let { page } = ctx.query

    if (!page) {
      page = 1
    }
    let count = await ProblemReply
      .find({})

    let list = await ProblemReply
      .find({})
      .populate('adminUser')
      .populate({
        path: 'problem',
        populate: {
          path: 'user'
        }
      })
      .skip((page - 1) * 50)
      .limit(50)
      .exec()
    ctx.body = {
      success: true,
      data: list,
      count: Math.round(count.length / 50) ? new Array(Math.round(count.length / 50)) : new Array(Math.round(count.length / 50) + 1)
    }
  }

  /* 邮件回复 */
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

    const data = {
      problem_id: replyMsg._id
    }

    const callbackMsg = await axios.post('http://localhost:5000/mina/postTemplate', data)

    console.log(callbackMsg.data)
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
  /* unsolved problems */
  @get('unsolvedProblems')
  async fetchUnsolvedProblems (ctx, next) {
    let { page } = ctx.query

    if (!page) {
      page = 1
    }
    console.log("请求的是第"+page+"页")
    let count = await Problem
      .find({solve: false})
    console.log("未回复总长度："+count.length)
    let List = await Problem
      .find({solve: false})
      .populate('user')
      .populate('reply')
      .skip((page - 1) * 50)
      .limit(50)
      .exec()
    ctx.body = {
      success: true,
      data: List,
      count: Math.round(count.length / 50) ? new Array(Math.round(count.length / 50)) : new Array(Math.round(count.length / 50) + 1)
    }
  }

  /* all problems */
  @get('problemList')
  async fetchProblems (ctx, next) {
    let { page } = ctx.query

    if (!page) {
      page = 1
    }
    let count = await Problem
      .find({})
    console.log(count.length)
    let List = await Problem
      .find({})
      .populate('user')
      .populate('reply')
      .skip((page - 1) * 50)
      .limit(50)
      .exec()
    ctx.body = {
      success: true,
      data: List,
      count: Math.round(count.lengtht / 50) ? new Array(Math.round(count.length / 50)) : new Array(Math.round(count.length / 50) + 1)
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
