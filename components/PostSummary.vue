<template>
  <v-row>
    <v-col cols="12 wow fadeInUp" data-wow-duration="500ms">
      <v-card class="mx-auto" :loading="loading">
        <v-img
          :aspect-ratio="16 / 4"
          :alt="post.title"
          :src="getImageUrl(post.coverImage._id)"
          :lazy-src="getImageUrl(post.coverImage._id)"
          class="white--text align-end"
          gradient="to bottom, rgba(0,0,0,.2), rgba(0,0,0,.75)"
          width="100%"
          eager
        >
          <v-card-title class="postTitle">
            <router-link :to="'/post/' + post.slug" title="Continuar lendo">
              {{ post.title }}
            </router-link>
          </v-card-title>
        </v-img>
        <PostInfo :post="post" />
        <v-card-text class="text--primary text-justify">
          {{ summary(post.text) }}
        </v-card-text>
        <PostEnd :post="post" class="pb-5" />
        <v-btn
          class="wow infinite pulse read-more"
          data-wow-duration="3s"
          depressed
          large
          color="primary"
          :to="'/post/' + post.slug"
        >
          Continuar lendo
        </v-btn>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.postTitle {
  font-size: 2em !important;
}
.postTitle > a {
  text-decoration: none;
  color: #fff;
}
.read-more {
  position: absolute;
  right: 15px;
  bottom: 15px;
}
</style>

<script>
import utils from '~/assets/js/utils'
import PostInfo from '~/components/PostInfo.vue'
import PostEnd from '~/components/PostEnd.vue'
export default {
  components: {
    PostInfo,
    PostEnd
  },
  props: {
    post: Object
  },
  data() {
    return {
      loading: false
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      setTimeout(() => {
        window.wow.sync()
      }, 100)
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 500)
    },
    getImageUrl(id) {
      return utils.getImageUrl(id)
    },
    removeHtml(value) {
      return utils.removeHtml(value)
    },
    summary(text) {
      const limit = 300
      let textNoHtml = this.removeHtml(text)
      if (textNoHtml.length > limit) {
        textNoHtml = textNoHtml.substr(0, limit) + '...'
      }
      return textNoHtml
    }
  }
}
</script>
