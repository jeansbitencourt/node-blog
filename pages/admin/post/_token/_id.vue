<template>
  <v-container>
    <no-ssr>
      <v-card class="pa-2">
        <v-row>
          <v-col cols="12">
            <v-layout>
              <v-flex md8>
                <v-toolbar-title class="white--text">
                  {{ id ? 'Editar postagem' : 'Cadastrar nova postagem' }}
                </v-toolbar-title>
              </v-flex>
              <v-flex md4 text-right>
                <v-btn @click="save" color="primary">Salvar</v-btn>
                <v-btn @click="back" color="red" class="ml-3">Cancelar</v-btn>
              </v-flex>
            </v-layout>
            <v-spacer />
            <v-layout>
              <v-flex md10>
                <v-text-field
                  v-model="title"
                  label="Título da postagem"
                  required
                />
              </v-flex>
              <v-flex pl-5 md2>
                <v-switch
                  v-model="published"
                  color="primary"
                  :label="published ? 'Publicado' : 'Não publicado'"
                  required
                />
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex md6>
                <v-select
                  v-model="categories"
                  :items="categoriesList"
                  item-text="name"
                  item-value="_id"
                  attach
                  chips
                  label="Categorias"
                  multiple
                />
              </v-flex>
              <v-flex md6 pt-2 pl-5 pr-2>
                <v-combobox
                  v-model="keywords"
                  hide-selected
                  label="Palavras chaves para a postagem"
                  multiple
                  persistent-hint
                  small-chips
                  clearable
                />
              </v-flex>
            </v-layout>
            <trumbowyg
              v-model="text"
              :config="config"
              class="form-control editor"
              name="content"
            />
            <v-layout>
              <v-flex md4>
                <v-file-input
                  @change="onFileChange"
                  chips
                  show-size
                  :rules="fileRules"
                  label="Enviar imagem"
                  prepend-icon="mdi-camera"
                  accept="image/png, image/jpeg, image/bmp, image/gif"
                />
              </v-flex>
              <v-flex md2 pl-5 pt-3>
                <v-btn color="primary" :disabled="!file" @click="onFileUpload">
                  Enviar imagem
                </v-btn>
              </v-flex>
              <v-flex md2 v-for="(image, i) in images" :key="i">
                <v-img
                  :src="'/api/images/data/' + image"
                  aspect-ratio="1.7"
                  contain
                  @click.stop="
                    showImgModal = true
                    imgModal = '/api/images/data/' + image
                  "
                  class="img"
                />
              </v-flex>
            </v-layout>
          </v-col>
        </v-row>
      </v-card>
      <v-dialog v-model="showImgModal" max-width="800px">
        <v-card>
          <v-card-actions>
            <v-img :src="imgModal" aspect-ratio="2" contain />
            <v-text-field
              :value="imgModal"
              label="URL da imagem"
              @click="copyUrl"
              id="inputUrlImg"
              readonly
            />
            <v-btn color="red" @click="deleteImage(imgModal)">
              Excluir
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </no-ssr>
  </v-container>
</template>

<style>
.editor {
  height: 400px;
}
.trumbowyg-button-pane {
  z-index: 3 !important;
}
.img {
  cursor: pointer;
}
</style>

<script>
export default {
  middleware: 'isAuthor',
  mounted() {
    this.initialize()
    if (this.id) {
      this.$store.dispatch('post/getPost', this.id).then(() => {
        this.getPostData()
      })
    }
  },
  computed: {
    categoriesList() {
      return this.$store.state.category.list
    },
    getPost() {
      return this.$store.state.post.post
    },
    getImage() {
      return this.$store.state.image.image
    }
  },
  data() {
    return {
      showImgModal: false,
      imgModal: null,
      id: this.$route.params.id,
      config: {
        disabled: false
      },
      fileRules: [
        (value) => {
          return (
            !value ||
            value.size < 2000000 ||
            'Imagem não pode ter mais do que 2MB!'
          )
        }
      ],
      title: null,
      published: false,
      categories: [],
      keywords: null,
      text: null,
      file: null,
      images: []
    }
  },
  methods: {
    initialize(reloadLinks) {
      this.$store.dispatch('category/getList')
    },
    back() {
      this.$router.back()
    },
    save() {
      if (!this.title || !this.categories || !this.keywords || !this.text) {
        this.$toast.error('Erro ao salvar! Preencha todos os campos!')
      } else if (this.id) {
        this.$store
          .dispatch('post/save', {
            _id: this.id,
            title: this.title,
            categories: this.categories,
            keywords: this.keywords,
            published: this.published,
            text: this.text,
            images: this.images
          })
          .then(() => {
            this.getPostData()
          })
      } else {
        this.$store
          .dispatch('post/create', {
            title: this.title,
            categories: this.categories,
            keywords: this.keywords,
            published: this.published,
            text: this.text,
            images: this.images
          })
          .then(() => {
            this.getPostData()
          })
      }
    },
    getPostData() {
      const post = this.getPost
      if (post) {
        this.title = post.title
        this.categories = post.categories
        this.published = post.published
        this.text = post.text
        this.id = post._id
        this.keywords = post.keywords
        this.images = []
        post.images.forEach((image) => {
          this.images.push(image._id)
        })
      } else {
        this.$toast.error('Erro 404, postagem não encontrada')
        setTimeout(() => {
          this.back()
        }, 4000)
      }
    },
    onFileChange(file) {
      if (file) {
        if (file.type.substring(0, 5) === 'image') {
          this.file = file
        } else {
          this.file = null
          this.$toast.error('Erro! Formato de arquivo inválido!')
        }
      } else {
        this.file = null
      }
    },
    onFileUpload() {
      if (this.file) {
        this.$toast.info('Enviando o arquivo ' + this.file.name)
        this.$store.dispatch('image/create', this.file).then(() => {
          this.images.push(this.getImage._id)
          this.save()
          this.file = null
        })
      } else {
        this.$toast.error('Erro ao enviar! Selecione um arquivo de imagem!')
      }
    },
    copyUrl() {
      const input = document.getElementById('inputUrlImg')
      input.select()
      input.setSelectionRange(0, 99999)
      document.execCommand('copy')
      this.$toast.info('URL copiada!')
      this.showImgModal = false
    },
    deleteImage(image) {
      const urlSplit = image.split('/')
      const imageId = urlSplit[urlSplit.length - 1]
      this.images.forEach((img, i, obj) => {
        if (imageId === img) {
          obj.splice(i, 1)
        }
      })
      this.$store.dispatch('image/delete', {
        item: {
          _id: imageId
        },
        onSuccess: () => {
          this.showImgModal = false
          this.file = null
          this.save()
        }
      })
    }
  }
}
</script>
