<template>
  <v-layout grid-list-md text-center v-if="category">
    {{ category.slug }}
    {{ postList }}
    {{ page }}
    {{ category.count }}
    <div class="text-center">
      <v-pagination
        v-model="page"
        :length="Math.ceil(category.count / 5)"
        @input="onPageChange"
      ></v-pagination>
    </div>
  </v-layout>
</template>

<script>
import utils from '~/assets/js/utils'
export default {
  middleware: 'validateLogin',
  data() {
    return {
      categorySlug: this.$route.params.slug
    }
  },
  computed: {
    category() {
      return this.$store.state.category.category
    },
    postList() {
      return this.$store.state.post.list
    },
    page() {
      return this.$store.state.category.page
    }
  },
  async fetch({ store, params }) {
    let page = 1
    if (params.page) {
      page = parseInt(params.page)
    }
    await store.commit('category/setPage', page)
    await store.dispatch('category/getCategory', params.slug)
    if (store.state.category.category && store.state.category.category._id) {
      await store.dispatch('post/getListByCategory', {
        categoryId: store.state.category.category._id,
        page: store.state.category.page
      })
    }
  },
  mounted() {
    if (!this.category) {
      this.$toast.error(
        'Categoria não encontada! Redirencionando para página inicial...'
      )
      this.$router.push('/')
    }
    if ((!this.postList || this.postList.length === 0) && this.page > 1) {
      this.$toast.error(
        'Página vazia! Redirencionando para primeira página da categoria...'
      )
      this.$router.push('/category/' + this.category.slug)
    }
  },
  methods: {
    onPageChange(newPage) {
      this.$router.push(`/category/${this.category.slug}/${newPage}`)
    },
    getImageUrl(id) {
      return utils.getImageUrl(id)
    }
  }
}
</script>
