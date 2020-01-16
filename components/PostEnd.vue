<template>
  <v-row justify="center">
    <v-col cols="12" sm="10" md="8">
      <v-divider class="mb-2" />
      <span class="dotted">
        {{ post.keywords.length > 1 ? 'Palavras-chave: ' : 'Palavra-chave: ' }}
      </span>
      <v-chip v-for="(keyword, i) in post.keywords" :key="i" small class="ml-1">
        {{ keyword }}
      </v-chip>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    post: Object
  }
}
</script>
