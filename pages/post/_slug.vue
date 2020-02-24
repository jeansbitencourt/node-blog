<template>
  <v-container v-if="post">
    <v-row>
      <v-col cols="12" class="text-center">
        <h1>{{ post.title }}</h1>
      </v-col>
    </v-row>
    <v-row v-if="post.coverImage" justify="center">
      <v-col cols="12" class="text-center" sm="10" md="10">
        <img class="cover" :src="getImageUrl(post.coverImage._id)" />
      </v-col>
    </v-row>
    <PostInfo :post="post" />
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" v-html="post.text" class="text" />
    </v-row>
    <PostEnd :post="post" />
  </v-container>
</template>

<style scoped>
img.cover {
  width: 100%;
}
</style>

<script>
import utils from '~/assets/js/utils'
import PostInfo from '~/components/PostInfo.vue'
import PostEnd from '~/components/PostEnd.vue'
export default {
  middleware: 'validateLogin',
  components: {
    PostInfo,
    PostEnd
  },
  computed: {
    post() {
      return this.$store.state.post.post
    }
  },
  async fetch({ store, params }) {
    await store.dispatch('post/getPostBySlug', params.slug)
  },
  mounted() {
    if (!this.post) {
      this.$toast.error(
        'Postagem não encontada! Redirencionando para página inicial...'
      )
      this.$router.push('/')
    }
  },
  methods: {
    getImageUrl(id) {
      return utils.getImageUrl(id)
    }
  }
}
</script>
