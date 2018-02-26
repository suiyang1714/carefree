const mongoose = require('mongoose')
const { Schema } = mongoose

const ProblemReplySchema = new Schema({
  problem: {
    type: String,
    ref: 'Problem'
  },
  reply: String,
  adminUser: {
    type: String,
    ref: 'Admin'
  },
  isUserAccess:{
    type: Boolean,
    default: false
  },
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
ProblemReplySchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  next()
})

const ProblemReply = mongoose.model('ProblemReply', ProblemReplySchema)
