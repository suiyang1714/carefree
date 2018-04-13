<template lang="pug">
  .content
    el-table(:data='users', style='width: 100%', max-height='600')
      el-table-column(type='expand')
        template(slot-scope='props')
          el-form.demo-table-expand(label-position='left', inline='')
            el-form-item(label='昵称')
              span {{ props.row.nickname }}
            el-form-item(label='邮箱')
              span {{ props.row.email }}
            el-form-item(label='权限')
              span {{ props.row.meta.createdAt }}
      el-table-column(type='index', :index='indexMethod')
      el-table-column(label='昵称', prop='nickname')
      el-table-column(label='邮箱', prop='email')
      el-table-column(label='权限', prop='role')
      el-table-column(fixed='right', label='操作', width='60')
        template(slot-scope='scope')
          el-button(@click.native.prevent='deleteRow(scope.$index, users)', type='text', size='small')
            | 移除
    .edit-product(:class='{active: editing}')
      el-form(ref='form', :model='form', label-width='80px')
        h1  创建管理员
        el-form-item(label='昵称')
          el-input(v-model='form.nickname')
        el-form-item(label='邮箱')
          el-input(v-model='form.email')
        el-form-item(label='密码')
          el-input(v-model='form.password')
        el-form-item
          el-button(type='primary', @click='saveEdited', v-if='!isProduct') 创建管理员
          el-button(type='primary', @click='saveEdited', v-if='isProduct') 保存修改
          el-button(@click='editing = !editing') 取消
    .float-btn(@click='createUser')
      .material-icon add
</template>

<script>
  import { mapState } from 'vuex'
  import axios from 'axios'
  import vSnackbar from '~components/snackbar'

  export default {
    middleware: 'auth',
    layout: 'admin',
    head () {
      return {
        title: '用户列表'
      }
    },
    data () {
      return {
        isProduct: false,
        openSnackbar: false,
        edited: {

        },
        editing: false,
        form: {

        }
      }
    },
    async created () {
      this.$store.dispatch('fetchUsers')
    },
    mounted () {

    },
    computed: mapState([
      'users'
    ]),
    methods: {
      editedIntro (e) {
        let html = e.target.value
        html = html.replace(/\n/g, '<br/>')
        this.edited.intro = html
      },
      eidtProduct (item) {
        this.edited = item
        this.isProduct = true
        this.editing = true
      },
      createUser () {
        this.edited = { }
        this.isProduct = false
        this.editing = true
      },
      // 创建管理员
      async saveEdited () {
        console.log(this.form)

        // 创建新用户并刷新
        this.isProduct
          ? await this.$store.dispatch('fetchUsers', this.form)
          : await this.$store.dispatch('addUser', this.form)

        this.isProduct = false

        // 弹框
        const h = this.$createElement;
        this.$notify({
          title: '创建成功',
          message: h('i', { style: 'color: teal'}, '该账号的权限为普通管理员'),
          duration: 3000
        });

        this.form = {}
        this.editing = !this.editing
      },
      // 删除管理员
      deleteRow(index, rows) {
        // 后续再做吧
        // rows.splice(index, 1);
        const h = this.$createElement;
        this.$notify({
          title: '删除失败',
          message: h('i', { style: 'color: teal'}, '该账号没有权限删除用户'),
          duration: 3000
        });
      }
    },
    components: {
      vSnackbar
    }
  }
</script>
<style lang='sass', src='~static/sass/admin.sass', scoped/>
<style lang="scss" scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .edit-product {
    width: auto;
    height: auto;
    padding: 5%;
  }
</style>
