<template>
  <v-layout grid-list-md text-center>
    <v-container>
      <PostSummary v-for="(post, i) in postList" :key="i" :post="postList[i]" />
      <v-row v-if="!postList || postList.length === 0">
        <v-col cols="12" align="center">
          <span>Não há postagens cadastradas!</span>
          <v-img
            class="my-10"
            src="/img/notfoundsearch.png"
            lazy-src="/img/notfoundsearch.png"
            width="200px"
          />
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
  computed: {
    count() {
      return this.$store.state.post.count
    },
    postList() {
      return this.$store.state.post.list
    },
    page: {
      get() {
        return this.$store.state.post.page
      },
      set(page) {
        this.$store.commit('post/setPage', page)
      }
    }
  },
  async fetch({ store, params }) {
    await store.commit('post/setPage', 1)
    await store.dispatch('post/getListLast', store.state.post.page)
  },
  mounted() {
    if ((!this.postList || this.postList.length === 0) && this.page > 1) {
      this.$toast.error('Não há postagens para exibir!')
    } else {
      this.scroll()
    }
  },
  methods: {
    scroll() {
      window.onscroll = () => {
        const bottomOfWindow =
          Math.max(
            window.pageYOffset,
            document.documentElement.scrollTop,
            document.body.scrollTop
          ) +
            window.innerHeight ===
          document.documentElement.offsetHeight
        if (bottomOfWindow) {
          this.addPage()
        }
      }
    },
    addPage() {
      this.page++
    }
  }
}
</script>
