<template lang="pug">
  .content
    .related-products
      table.table
        thead
          tr
            th 昵称
            th 邮箱
            th 修改
        tbody
          tr(v-for='item in users')
            td {{item.nickname}}
            td {{item.email}}
            td
              button.btn(@click='eidtProduct(item)')
                .material-icon(style='font-size: 20px') edit

    .edit-product(:class='{active: editing}')
      .edit-header
        .material-icon edit
        div(style='flex: 1')
        .material-icon(@click='editing = !editing') close
      .edit-body
        .form.edit-form
          .input-group
            label 昵称
            input(v-model='edited.nickname')
          .input-group
            label 邮箱
            input(v-model='edited.email', type='email')
          .input-group
            label 密码
            input(v-model='edited.password')
      .edit-footer
        button.btn.save(@click='saveEdited', v-if='!isProduct') 创建管理员
        button.btn.save(@click='saveEdited', v-if='isProduct') 保存修改
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
        title: '用户列表'
      }
    },
    data () {
      return {
        isProduct: false,
        openSnackbar: false,
        edited: {
          images: [],
          parameters: []
        },
        editing: false
      }
    },
    async created () {
      this.$store.dispatch('fetchUsers')
    },
    mounted () {
      let polyline = document.querySelector('#outline')
      let totalLength = polyline.getTotalLength()

      this.upload.dasharray = totalLength
      this.upload.dashoffset = totalLength
    },
    computed: mapState([
      'imageCDN',
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
