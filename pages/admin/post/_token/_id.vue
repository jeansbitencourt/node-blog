<template>
  <v-layout>
    <v-flex text-xs-center>
      <img src="/v.png" alt="Vuetify.js" class="mb-5" />
      <blockquote class="blockquote">
        &#8220;POST EDIT ID&#8221;
        <footer>
          <small>
            <em>&mdash;John Johnson</em>
          </small>
        </footer>
      </blockquote>
      <div>
        <trumbowyg
          v-model="content"
          :config="config"
          class="form-control"
          name="content"
        />
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  middleware: 'isAuthor',
  mounted() {},
  data() {
    return {
      content: null,
      config: {}
    }
  }
}
</script>
