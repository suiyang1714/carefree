const mongoose = require('mongoose')
const { Schema } = mongoose

const EmailSchema = new Schema({
  emailMsg: String,
  emailType: String,
  intro: String,
  solve: {
    type: Boolean,
    default: false
  },
  openid: String,
  nickname: String,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})
EmailSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  next()
})

const Email = mongoose.model('Email', EmailSchema)
