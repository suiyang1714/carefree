<template lang="pug">
  .content
    .related-products
      table.table
        thead
          tr
            th 用户昵称
            th 邮件类型
            th 邮件信息
        tbody
          tr(v-for='item in emails')
            td {{item.nickname}}
            td {{item.emailType}}
            td {{item.emailMsg}}
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
        title: '邮件列表'
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
      this.$store.dispatch('fetchEmails')
    },
    computed: mapState([
      'emails'
    ]),
    methods: {

    },
    components: {
      vSnackbar
    }
  }
</script>
<style lang='sass', src='~static/sass/admin.sass', scoped/>
