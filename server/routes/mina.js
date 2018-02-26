import { controller, get, post, required } from '../decorator/router'
import { resolve } from 'path'
import mongoose from 'mongoose'
import crypto from 'crypto'
import axios from 'axios'
import http from 'http'
import {
  openidAndSessionKey,
  WXBizDataCrypt
} from "../wechat-lib/mina"
import config from '../config'

const MinaUser = mongoose.model('MinaUser')
const Problem = mongoose.model('Problem')
const ProblemReply = mongoose.model('ProblemReply')

@controller('/mina')
export class minaController {
  @get('wechat-notify')
  async wechatNotify (ctx, next) {
    console.log('请求了')
    console.log(ctx.request.body)
    ctx.body = {
      success: true
    }
  }

  /* 支付 */
  @get('payment')
  @required({query: ['total_fee', 'code'] })
  async createPlayTour (ctx, next ) {
    const { total_fee, code, iv, encryptedData } = ctx.query
    const minaUser = await openidAndSessionKey(code)

    let pc = new WXBizDataCrypt(minaUser.session_key)

    let data = pc.decryptData(encryptedData, iv)
    const openid = data.openId
    const ip = ctx.ip.replace('::ffff:', '')
    const appid = config.mina.appid
    const mchid = "1498685972"
    const key = "323jjoJJYG322NNMkkkj3232k99873ww"
    const requestUrl = "https://api.mch.weixin.qq.com/pay/unifiedorder";
    const upsetArr = (arr) => {
      return arr.sort(function(){ return Math.random() - 0.5});
    }
    const raw1 = (args) => {
      var keys = Object.keys(args);
      keys = keys.sort()
      var newArgs = {};
      keys.forEach(function(key) {
        newArgs[key] = args[key];
      });

      var string = '';
      for(var k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
      }
      string = string.substr(1);
      return string;
    }
    const paysignjs = (appid, nonceStr, Package, signType, timeStamp) => {
      var ret = {
        appId: appid,
        nonceStr: nonceStr,
        package: Package,
        signType: signType,
        timeStamp: timeStamp
      };
      var string = raw1(ret);
      string = string + '&key='+key;
      return crypto.createHash('md5').update(string, 'utf8').digest('hex').toUpperCase();
    }

    const paySignJsapi = (appid, attach, body, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee, trade_type) => {
      var ret = {
        appid: appid,
        attach: attach,
        body: body,
        mch_id: mch_id,
        nonce_str: nonce_str,
        notify_url: notify_url,
        openid: openid,
        out_trade_no: out_trade_no,
        spbill_create_ip: spbill_create_ip,
        total_fee: total_fee,
        trade_type: trade_type
      };
      var string = raw(ret);
      string = string + '&key='+key;
      console.log(string)
      return crypto.createHash('md5').update(string, 'utf8').digest('hex').toUpperCase();
    };

    const raw = (args) => {
      var keys = Object.keys(args);
      keys = keys.sort()
      var newArgs = {};
      keys.forEach(function(key) {
        newArgs[key.toLowerCase()] = args[key];
      });

      var string = '';
      for(var k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
      }
      string = string.substr(1);
      return string;
    };
    const timeStamp = Date.parse(new Date())
    const nonceStr = upsetArr("5K8264ILTKCH16CQ2502SI8ZNMTM67VS".split("")).join("")
    let Package = ''
    const signType = "MD5"
    const attach = '打赏支付'
    const body = '感谢您的支持'
    const notify_url = 'http://19170l14u5.imwork.net:35309/mina/wechat-notify'
    const paysignjsapi = paySignJsapi(appid, attach, body, mchid, nonceStr, notify_url, openid, timeStamp, ip, total_fee, 'JSAPI')
    let formData = `<xml>
      <appid>${appid}</appid>
      <attach>${attach}</attach>
      <body>${body}</body>
      <mch_id>${mchid}</mch_id>
      <nonce_str>${nonceStr}</nonce_str>
      <notify_url>${notify_url}</notify_url>
      <openid>${openid}</openid>
      <out_trade_no>${timeStamp}</out_trade_no>
      <spbill_create_ip>${ip}</spbill_create_ip>
      <total_fee>${total_fee}</total_fee>
      <trade_type>JSAPI</trade_type>
      <sign>${paysignjsapi}</sign>
    </xml>`

    console.log(formData)
    const getXMLNodeValue = (node_name, xml) =>{
      let tmp = xml.split("<" + node_name + "><![CDATA[");
      let _tmp = tmp[1].split("]]></" + node_name + ">");
      return _tmp[0];
    }
    let paySign
    await axios.post(`${requestUrl}`, formData).then(function(res){
      console.log(res.data)
      const prepay_id = getXMLNodeValue('prepay_id', res.data.toString("utf-8"))
      Package = 'prepay_id='+prepay_id
      console.log(prepay_id)
      paySign = paysignjs(appid, nonceStr, 'prepay_id='+prepay_id, signType, timeStamp)

    })
    console.log(Package)
    ctx.body = {
      data: {
        appId: appid,
        nonceStr: nonceStr,
        package: Package,
        signType: signType,
        timeStamp: timeStamp,
        paySign: paySign
      }

    }

  }

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

    if (reply.length != 0) {
      const array = reply
      array.forEach(function (item) {
        if (item.solve && item.reply.isUserAccess == false) {
          return ctx.body = {
            success: true,
            data: reply
          }
        }
      })
    } else {
      return ctx.body = {
        success: false
      }
    }
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
