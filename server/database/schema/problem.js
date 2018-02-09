const mongoose = require('mongoose')
const { Schema } = mongoose

const ProblemSchema = new Schema({
  user: {
    type: String,
    ref: 'MinaUser'
  },
  problemType: String,
  problem: String,
  satisfaction: {
    type: Boolean,
    default: false
  },
  solve: {
    type: Boolean,
    default: false
  },
  reply: {
    type: String,
    ref: 'ProblemReply'
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
ProblemSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updatedAt = Date.now()
  } else {
    this.meta.updatedAt = Date.now()
  }

  next()
})

const Problem = mongoose.model('Problem', ProblemSchema)
