<template lang="pug">
  .content
    .related-products
      table.table
        thead
          tr
            th openId
            th 用户昵称
            th 邮件类型
            th 邮件信息
            th 操作
        tbody
          tr(v-for='item in emails', v-if="!item.solve")
              td {{item.openid}}
              td {{item.nickname}}
              td {{item.emailMsg}}
              td {{item.emailType}}
              td
              button.btn(@click='eidtReply(item)')
                .material-icon(style='font-size: 20px') 回信

    .edit-product(:class='{active: editing}')
      .edit-header
        .material-icon edit
        div(style='flex: 1')
        .material-icon(@click='editing = !editing') close
      .edit-body
        .form.edit-form(v-if='!isProduct')
          .input-group
            label openId
            input(v-model='edited.openid')
          .input-group
            label nickName
            input(v-model='edited.openid')
          .input-group
            label 回信内容
            textarea(v-model='edited.reply', @keyup='editedIntro')
        .form.edit-form(v-if='isProduct')
          .input-group
            label openId
            input(v-model='edited.openid')
          .input-group
            label nickName
            input(v-model='edited.nickname')
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
        title: '未解决回信列表'
      }
    },
    data () {
      return {
        isProduct: false,
        openSnackbar: false,
        edited: {
          openid: String,
          nickname: String
        },
        editing: false
      }
    },
    async created () {
      this.$store.dispatch('fetchUsers')
    },
    mounted () {
        //待写
    },
    computed: mapState([
      'emails'
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
        console.log(this.edited)
        this.isProduct
          ? await this.$store.dispatch('fetchUsers', this.edited)
          : await this.$store.dispatch('addUser', this.edited)

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
