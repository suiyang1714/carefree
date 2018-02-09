import fs from 'fs'
import { resolve } from 'path'
import mongoose from 'mongoose'
import config from '../config'

const models = resolve(__dirname, '../database/schema');

fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*js$/))
  .forEach(file => require(resolve(models, file)));

export const database = app =>{
    mongoose.set('debug', true);
    mongoose.Promise = global.Promise;
    mongoose.connect(config.db,{useMongoClient:true});
    mongoose.connection.on('disconnected', () => {
        mongoose.connect(config.db,{useMongoClient:true});
    });
    mongoose.connection.on('error', err => {
        console.error(err);
    });

    mongoose.connection.on('open', async () => {

      console.log('Connected to MongoDB ', config.db);

      const Admin = mongoose.model('Admin')
      let user = await Admin.findOne({
        email: 'wangpengchao@carefree.com'
      })

      if (!user) {
        console.log('写入管理员数据')

        user = new Admin({
          email: 'wangpengchao@carefree.com',
          password: 'wangpengchao',
          role: 'superAdmin',
          nickname: '王老板'
        })

        await user.save()
      }

    });

};
