<template lang="pug">
    .content
        .related-products
            table.table
                thead
                    tr
                        th 图片
                        th 标题
                        th 价格
                        th 简介
                        th 参数
                        th 修改
                tbody
                    tr(v-for='item in products')
                        td
                            .img(v-for='image in item.images')
                                img(:src='imageCDN + image + "?imageView2/1/format/jpg/q/75|imageslim"')
                        td {{item.title}}
                        td {{item.price}}
                        td(v-html='item.intro')
                        td
                            p(v-for='parameter in item.parameters') {{parameter.key}} {{parameter.value}}
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
                        label 标题
                        input(v-model='edited.title')
                    .input-group
                        label 价格
                        input(v-model.number='edited.price', type='number')
                    .input-group
                        label 简介
                        textarea(v-model='edited.intro', @keyup='editedIntro')
                    .input-group
                        label 参数
                        .parameters
                            .inputs(v-for='item, index in edited.parameters')
                                input(v-model='item.key', placeholder='名称')
                                input(v-model='item.value', placeholder='值')
                                .remove(@click='removeParameter(index)')
                                    .material-icon remove
            .edit-footer
                button.btn.save(@click='saveEdited', v-if='!isProduct') 创建周边
                button.btn.save(@click='saveEdited', v-if='isProduct') 保存修改

                .btn.add-parameter(@click='addParameter')
                    .material-icon add
                    | 添加参数
        .float-btn(@click='createProduct')
            .material-icon add
        v-snackbar(:open.sync='openSnackbar')
            span(slot='body') 保存成功
</template>

<script>
  import { mapState } from 'vuex'
  import axios from 'axios'
/*
  import randomToken from 'random-token'
  import Uploader from 'qiniu-web-uploader'
*/
  import vSnackbar from '~components/snackbar'

  export default {
    layout: 'admin',
    head () {
      return {
        title: '商品列表'
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
        upload: {
          dasharray: 0,
          dashoffset: 0
        },
        editing: false
      }
    },
    async created () {
      this.$store.dispatch('fetchProducts')
    },
    mounted () {
      /*let polyline = document.querySelector('#outline')
      let totalLength = polyline.getTotalLength()

      this.upload.dasharray = totalLength
      this.upload.dashoffset = totalLength*/
    },
    computed: mapState([
      'imageCDN',
      'products'
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
      createProduct () {
        this.edited = {
          images: [],
          parameters: []
        }
        this.isProduct = false
        this.editing = true
      },
      async saveEdited () {
        this.isProduct
          ? await this.$store.dispatch('putProduct', this.edited)
          : await this.$store.dispatch('saveProduct', this.edited)

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
      }
    },
    components: {
      vSnackbar
    }
  }
</script>
<style lang='sass', src='~static/sass/admin.sass', scoped/>
