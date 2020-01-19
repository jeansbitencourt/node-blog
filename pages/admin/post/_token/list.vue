<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      sort-by="creationDate"
      sort-desc
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical />
          <div class="flex-grow-1" />
          <v-dialog max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn
                color="primary"
                class="mb-2"
                :to="'/admin/post/' + userToken"
                v-on="on"
              >
                Nova postagem
              </v-btn>
              <v-btn
                color="secondary"
                class="mb-2 mr-4"
                v-show="
                  user.permissions && user.permissions.isAdmin && !showDeleted
                "
                @click="showDeletedPosts(true)"
              >
                Ver postagens excluídas
              </v-btn>
              <v-btn
                color="secondary"
                class="mb-2 mr-4"
                v-show="
                  user.permissions && user.permissions.isAdmin && showDeleted
                "
                @click="showDeletedPosts(false)"
              >
                Ver postagens não excluídas
              </v-btn>
            </template>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          edit
        </v-icon>
        <v-icon small class="mr-2" @click="deleteItem(item)">
          delete
        </v-icon>
        <v-icon small @click="seeItem(item)">
          visibility
        </v-icon>
      </template>
      <template v-slot:no-data>
        Não há itens
        <v-btn text color="primary" click="initialize">
          Tentar carregar a lista novamente
        </v-btn>
      </template>
      <template v-slot:item.published="{ item }">
        {{ item.published ? 'Publicado' : 'Não publicado' }}
      </template>
      <template v-slot:item.categories="{ item }">
        <v-chip v-for="(category, i) in item.categories" :key="i" class="ml-1">
          {{ category.name }}
        </v-chip>
      </template>
      <template v-slot:item.keywords="{ item }">
        <v-chip
          v-for="(keyword, i) in item.keywords"
          :key="i"
          small
          class="ml-1"
        >
          {{ keyword }}
        </v-chip>
      </template>
      <template v-slot:item.creationDate="{ item }">
        {{ dateToStr(item.creationDate) }}
      </template>
      <template v-slot:item.updateDate="{ item }">
        {{ dateToStr(item.updateDate) }}
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import utils from '~/assets/js/utils'
export default {
  middleware: 'isAuthor',
  data() {
    return {
      pageTitle: 'Lista de postagens',
      editedIndex: -1,
      editedItem: {
        name: '',
        description: '',
        icon: ''
      },
      defaultItem: {
        name: '',
        description: '',
        icon: ''
      },
      headers: [
        {
          text: 'Título',
          value: 'title'
        },
        {
          text: 'Categorias',
          value: 'categories'
        },
        {
          text: 'Keywords',
          value: 'keywords'
        },
        {
          text: 'Data de criação',
          value: 'creationDate'
        },
        {
          text: 'Data de última edição',
          value: 'updateDate'
        },
        {
          text: 'Status',
          value: 'published'
        },
        {
          text: 'Ações',
          value: 'action',
          sortable: false
        }
      ],
      showDeleted: false
    }
  },
  computed: {
    items() {
      const storeList = this.$store.state.post.list
      if (this.user.permissions && this.user.permissions.isAdmin) {
        const modifiedList = []
        storeList.forEach((item) => {
          if (this.showDeleted && item.deleted) {
            modifiedList.push(item)
          }
          if (!this.showDeleted && !item.deleted) {
            modifiedList.push(item)
          }
        })
        return modifiedList
      }
      return storeList
    },
    userToken() {
      return this.$store.state.login.userToken
    },
    user() {
      return this.$store.state.login.userData
    }
  },
  created() {
    this.initialize()
  },
  methods: {
    initialize() {
      this.$store.dispatch('post/getList')
    },

    editItem(item) {
      this.$router.push('/admin/post/' + this.userToken + '/' + item._id)
    },

    deleteItem(item) {
      this.$store.dispatch('post/delete', {
        item: item,
        onSuccess: () => {
          this.initialize()
        }
      })
    },

    seeItem(item) {
      this.$router.push('/post/' + item.slug)
    },

    dateToStr(date) {
      return utils.dateToStr(date)
    },

    showDeletedPosts(show) {
      this.showDeleted = show
      if (show) {
        this.pageTitle = 'Lista de postagens excluídas'
      } else {
        this.pageTitle = 'Lista de postagens'
      }
    }
  }
}
</script>
