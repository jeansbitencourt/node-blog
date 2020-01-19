<template>
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
      <span class="dotted">
        {{ post.categories.length > 1 ? 'Categorias: ' : 'Categoria: ' }}
      </span>
      <v-chip
        v-for="(category, i) in post.categories"
        :key="i"
        small
        class="ml-1"
        :to="'/category/' + category.slug"
      >
        {{ category.name }}
      </v-chip>
      <v-divider class="mt-2" />
    </v-col>
  </v-row>
</template>

<style>
.dotted {
  text-decoration: underline;
  text-decoration-style: dotted;
}
</style>

<script>
import utils from '~/assets/js/utils'
export default {
  props: {
    post: Object
  },
  methods: {
    dateToStr(date) {
      return utils.dateToStr(date)
    }
  }
}
</script>
