<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      sort-by="creationDate"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical />
          <div class="flex-grow-1"></div>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">
                Nova categoria
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="8">
                      <v-text-field
                        v-model="editedItem.name"
                        label="Nome da categoria"
                      />
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="editedItem.icon"
                        label="Nome do ícone"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.description"
                        label="Breve descrição"
                      />
                      <a
                        href="https://material.io/resources/icons/?style=baseline"
                        target="_blank"
                      >
                        Clique aqui para ver os ícones disponíveis
                      </a>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="red" @click="close">
                  Cancelar
                </v-btn>
                <v-btn color="primary" @click="save">Salvar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.icon="{ item }">
        <v-icon small class="mr-2">
          {{ item.icon }}
        </v-icon>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          edit
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize(false)">Carregar lista</v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  middleware: 'isAdmin',
  computed: {
    items() {
      return this.$store.state.category.list
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Novo item' : 'Editar item'
    }
  },
  created() {
    this.initialize(false)
  },
  data() {
    return {
      pageTitle: 'Lista de categorias',
      dialog: false,
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
          text: 'Nome',
          value: 'name'
        },
        {
          text: 'Descrição',
          value: 'description'
        },
        {
          text: 'Ícone',
          value: 'icon'
        },
        {
          text: 'Data de criação',
          value: 'creationDate'
        },
        {
          text: 'Ações',
          value: 'action',
          sortable: false
        }
      ]
    }
  },
  methods: {
    initialize(reloadLinks) {
      this.$store.dispatch('category/getList')
      if (reloadLinks) {
        this.$store.dispatch('category/loadLinks')
      }
    },

    editItem(item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.$store.dispatch('category/delete', {
        item: item,
        onSuccess: () => {
          this.initialize(true)
        }
      })
    },

    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save() {
      if (this.editedIndex > -1) {
        this.$store.dispatch('category/save', this.editedItem).then(() => {
          this.initialize(true)
        })
      } else {
        this.$store.dispatch('category/create', this.editedItem).then(() => {
          this.initialize(true)
        })
      }
      this.close()
    }
  },
  watch: {
    dialog(val) {
      val || this.close()
    }
  }
}
</script>
