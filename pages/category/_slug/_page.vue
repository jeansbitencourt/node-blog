<template>
  <v-layout v-if="category" grid-list-md text-center>
    <v-container>
      <PostSummary v-for="(post, i) in postList" :key="i" :post="postList[i]" />
      <v-row v-if="postList.length === 0">
        <v-col cols="12" align="center">
          <span>Não há postagens nessa categoria!</span>
          <v-img
            class="my-10"
            src="/img/notfoundsearch.png"
            lazy-src="/img/notfoundsearch.png"
            width="200px"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div class="text-center">
            <v-pagination
              v-model="page"
              :length="Math.ceil(category.count / 5)"
              :total-visible="10"
              @input="onPageChange"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>
import PostSummary from '~/components/PostSummary.vue'
export default {
  middleware: 'validateLogin',
  components: {
    PostSummary
  },
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
    page: {
      get() {
        return this.$store.state.category.page
      },
      set(page) {
        this.$store.commit('category/setPage', page)
      }
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
    }
  }
}
</script>
