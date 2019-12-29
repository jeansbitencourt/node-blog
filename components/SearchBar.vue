<template>
  <v-toolbar-title>
    <v-text-field
      v-model="search"
      append-icon="search"
      label="Buscar"
      single-line
      hide-details
      style="margin-bottom: 0.8em"
    />
  </v-toolbar-title>
</template>

<script>
export default {
  data() {
    return {
      search: null
    }
  }
}
</script>
