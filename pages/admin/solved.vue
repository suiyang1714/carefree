<template lang="pug">
  .content
    .related-products
      table.table
        thead
          tr
            th 头像
            th 用户昵称
            th 邮件类型
            th 邮件信息
            th 回复
            th 操作
        tbody
          tr(v-for='item in problems', v-if="!item.solve")
              td
                .img
                  img(:src='item.user.avatarUrl')
              td {{item.user.openid}}
              td {{item.user.nickname}}
              td {{item.problem}}
              td {{item.problemType}}
              td
                button.btn(@click='eidtReply(item)', style="margin: 0 auto;")
                  .material-icon(style='font-size: 20px') 回信

    .edit-product(:class='{active: editing}')
      .edit-header
        .material-icon edit
        div(style='flex: 1')
        .material-icon(@click='editing = !editing') close
      .edit-body
        .form.edit-form(v-if='!isProduct')
          .input-group
            label id
            input(v-model='edited._id')
          .input-group
            label 管理员邮箱
            input(v-model='user.email')
          .input-group
            label 用户昵称
            input(v-model='edited.nickname')
          .input-group
            label 回信内容
            textarea(v-model='edited.reply', @keyup='editedIntro')
        .form.edit-form(v-if='isProduct')
          .input-group
            label id
            input(v-model='edited._id')
          .input-group
            label 管理员邮箱
            input(v-model='user.email')
          .input-group
            label 用户昵称
            input(v-model='edited.user.nickname')
          .input-group
            label 回信内容
            textarea(v-model='edited.reply', @keyup='editedIntro')
      .edit-footer
        button.btn.save(@click='saveEdited', v-if='!isProduct') 创建新回信
        button.btn.save(@click='saveEdited', v-if='isProduct') 创建新回信
    .float-btn(@click='createUser')
      .material-icon add
    v-snackbar(:open.sync='openSnackbar')
      span(slot='body') 保存成功
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
        title: '未解决问题列表'
      }
    },
    data () {
      return {
        isProduct: false,
        openSnackbar: false,
        edited: {
          email: this.$store.state.user.email,
          user: {
            openid: String,
            nickname: String
          }
        },
        editing: false
      }
    },
    async created () {
      this.$store.dispatch('fetchProblems')
    },
    mounted () {
        //待写
    },
    computed: mapState([
      'problems',
      'user'
    ]),
    methods: {
      editedIntro (e) {
        let html = e.target.value
        html = html.replace(/\n/g, '<br/>')
        this.edited.intro = html
      },
      eidtReply (item) {
        this.edited = item
        this.isProduct = true
        this.editing = true
      },
      createUser () {
        this.edited = { }
        this.isProduct = false
        this.editing = true
      },
      async saveEdited () {
        this.isProduct
          ? await this.$store.dispatch('addReply', this.edited)
          : await this.$store.dispatch('addReply', this.edited)

        this.openSnackbar = true
        this.isProduct = false
        this.edited = {
          images: [],
          parameters: []
        }

        this.editing = !this.editing
      },
      removeParameter (index) {
        this.edited.parameters.splice(index, 1)
      },
      addParameter () {
        this.edited.parameters.push({ key: '', value: '' })
      },
      deleteImg (index) {
        this.edited.images.splice(index, 1)
      }
    },
    components: {
      vSnackbar
    }
  }
</script>
<style lang='sass', src='~static/sass/admin.sass', scoped/>
