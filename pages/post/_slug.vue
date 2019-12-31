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
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8">
        <span>Postado em {{ dateToStr(post.creationDate) }}</span>
        <span>
          por
          <strong>
            {{ post.createdBy.name.firstName }}
            {{ post.createdBy.name.lastName }}
          </strong>
        </span>
        <span>|</span>
        <span class="dotted">Categorias: </span>
        <v-chip
          v-for="(category, i) in post.categories"
          :key="i"
          small
          class="ml-1"
          :to="'/category/' + category.name.toLowerCase()"
        >
          {{ category.name }}
        </v-chip>
        <v-divider class="mt-2" />
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8">
        <p v-html="post.text"></p>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8">
        <v-divider class="mb-2" />
        <span class="dotted">Palavras-chave: </span>
        <v-chip
          v-for="(keyword, i) in post.keywords"
          :key="i"
          small
          class="ml-1"
        >
          {{ keyword }}
        </v-chip>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
img.cover {
  width: 100%;
}
.dotted {
  text-decoration: underline;
  text-decoration-style: dotted;
}
</style>

<script>
import utils from '~/assets/js/utils'
export default {
  middleware: 'validateLogin',
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
    dateToStr(date) {
      return utils.dateToStr(date)
    },
    getImageUrl(id) {
      return utils.getImageUrl(id)
    }
  }
}
</script>
