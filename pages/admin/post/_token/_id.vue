<template>
  <v-container fluid>
    <v-layout>
      <v-row>
        <v-col cols="12">
          <v-toolbar-title class="white--text">
            {{ id ? 'Editar postagem' : 'Cadastrar nova postagem' }}
          </v-toolbar-title>
          <v-spacer />
          <v-layout>
            <v-flex md10>
              <v-text-field
                v-model="title"
                label="Título da postagem"
                required
              />
            </v-flex>
            <v-flex md2>
              <v-switch
                v-model="published"
                color="primary"
                :label="published ? 'Publicado' : 'Não publicado'"
                :disabled="id === null || id === undefined"
              />
            </v-flex>
          </v-layout>
          <trumbowyg
            v-model="content"
            :config="config"
            class="form-control editor"
            name="content"
          />
          <v-btn color="secondary" @click="$refs.inputUpload.click()">
            Escolher uma imagem para envio
          </v-btn>
          <v-chip outlined v-if="fileName">
            {{ fileName }}
          </v-chip>
          <v-btn v-if="fileName" color="primary" @click="onFileUpload">
            Enviar imagem
          </v-btn>
          <v-btn v-if="fileName" color="red" @click="onFileCancel">
            Cancelar
          </v-btn>
          <input
            v-show="false"
            ref="inputUpload"
            type="file"
            @change="onFileChange"
            accept="image/*"
          />
        </v-col>
      </v-row>
    </v-layout>
  </v-container>
</template>

<style>
.editor {
  height: 400px;
}
.trumbowyg-button-pane {
  z-index: 3 !important;
}
</style>

<script>
export default {
  middleware: 'isAuthor',
  mounted() {},
  data() {
    return {
      id: this.$route.params.id,
      content: null,
      config: {
        disabled: false
      },
      title: '',
      published: false,
      fileName: false
    }
  },
  methods: {
    onFileChange() {
      console.log(this.$refs.inputUpload.files[0])
      const file = this.$refs.inputUpload.files[0]
      if (file) {
        if (file.type.substring(0, 5) === 'image') {
          this.fileName = file.name
        } else {
          this.fileName = false
          this.$toast.error('Erro! Formato de arquivo inválido!')
        }
      } else {
        this.fileName = false
      }
    },
    onFileCancel() {
      this.$refs.inputUpload.value = ''
      this.onFileChange()
    },
    onFileUpload() {
      this.$toast.info('Enviando o arquivo ' + this.fileName)
    }
  }
}
</script>
