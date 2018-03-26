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
            th 操作
        tbody
          tr(v-for='item in unsolvedproblems.data')
            td
              .img
                img(:src='item.user.avatarUrl')
            td {{item.user.nickname}}
            td {{item.user.problemType}}
            td {{item.problem}}
            td
              button.btn(@click='eidtReply(item)', style="margin: 0 auto;")
                .material-icon(style='font-size: 20px') 回信
    .pagination
      li
        a(v-on:click="pagination('prev')") «
      li(v-for="(n, index) in unsolvedproblems.count")
        a(v-on:click="pagination(index+1)") {{ index+1 }}
      li
        a(v-on:click="pagination('next')") »
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
        editing: false,
        activePage: 1
      }
    },
    async created () {
      this.activePage = Number(this.$route.query.page)
      await this.$store.dispatch('fetchUnsolvedProblems', this.activePage)
    },
    mounted () {
      //待写
    },
    computed: mapState([
      'unsolvedproblems',
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
      },
      async pagination (num) {
        if (Number(num)) {
          num = Number(num)
          this.activePage = num
          this.$router.push({path: '/admin/unsolved?page=' +  num})
          this.$store.dispatch('fetchUnsolvedProblems' , num)
        } else {
          if (this.activePage != 1 && num == 'prev'){

            this.activePage = this.activePage - 1
            this.$router.push({path: '/admin/unsolved?page=' + this.activePage })
            this.$store.dispatch('fetchUnsolvedProblems', this.activePage )
          }
          else if ( (this.activePage < this.$store.state.unsolvedproblems.count.length) && num == 'next') {
            this.activePage = this.activePage + 1
            this.$router.push({path: '/admin/unsolved?page=' + this.activePage})
            this.$store.dispatch('fetchUnsolvedProblems', this.activePage)
          }
        }
      }
    },
    components: {
      vSnackbar
    }
  }
</script>
<style>
  .pagination {
    display: inline-block;
    padding-left: 0;
    margin: 20px 0;
    border-radius: 4px;
  }
  .pagination>li {
    display: inline;
  }
  .pagination>li:first-child>a, .pagination>li:first-child>span {
    margin-left: 0;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .pagination>li:last-child>a, .pagination>li:last-child>span {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .pagination>li>a, .pagination>li>span {
    position: relative;
    float: left;
    padding: 6px 12px;
    margin-left: -1px;
    line-height: 1.42857143;
    color: #337ab7;
    text-decoration: none;
    background-color: #fff;
    border: 1px solid #ddd;
  }
</style>
<style lang='sass', src='~static/sass/admin.sass', scoped/>
