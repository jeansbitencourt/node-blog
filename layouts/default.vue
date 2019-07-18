<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-tile
          v-for="(category, i) in categories"
          :key="i"
          :to="category.route"
          router
        >
          <v-list-tile-action>
            <v-icon>{{ category.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="ucFirst(category.name)" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar :clipped-left="clipped" fixed app>
      <v-toolbar-side-icon @click="drawer = !drawer" />
      <v-btn v-show="drawer" icon @click.stop="miniVariant = !miniVariant">
        <v-icon>{{ `chevron_${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title
        v-text="blogName + (user.name ? ' - Olá ' + user.name.firstName : '')"
      />
      <v-spacer />
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
      <v-btn
        icon
        style="margin-left:3em"
        @click.stop="rightDrawer = !rightDrawer"
      >
        <v-icon>menu</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-navigation-drawer v-model="rightDrawer" :right="true" temporary fixed>
      <v-card v-if="!user.name">
        <v-card-title>
          <v-chip>Fazer login</v-chip>
          <v-text-field v-model="username" label="Usuário" />
          <v-text-field v-model="password" :type="'password'" label="Senha" />
        </v-card-title>
        <v-card-actions>
          <v-btn flat color="primary" @click="login">Entrar</v-btn>
        </v-card-actions>
      </v-card>
      <v-alert v-model="loginError" dismissible type="error">
        Erro ao realizar login! Verifique seu usuário e senha...
      </v-alert>
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }} - {{ blogName }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: true,
      miniVariant: false,
      rightDrawer: false,
      blogName: this.$store.state.blogName,
      search: '',
      username: '',
      password: ''
    }
  },
  computed: {
    categories() {
      return this.$store.state.categories
    },
    user() {
      return this.$store.state.userData
    },
    loginError: {
      get() {
        return this.$store.state.loginError
      },
      set(value) {
        this.$store.commit('setLoginError', value)
      }
    }
  },
  created() {
    this.$store.dispatch('loadLinks')
  },
  mounted() {
    const cookieTk = this.$cookie.get('tkUser')
    const cookieUser = this.$cookie.get('dtUser')
    if (cookieTk && cookieUser) {
      this.$store.dispatch('login', { token: cookieTk, user: cookieUser })
    }
  },
  methods: {
    ucFirst(word) {
      return word.charAt(0).toUpperCase() + word.slice(1)
    },
    login() {
      this.$store.dispatch('login', {
        userName: this.username,
        password: this.password,
        cookie: this.$cookie
      })
    }
  },
  head() {
    return {
      titleTemplate: this.blogName,
      meta: [{ huehue: 'sadads' }]
    }
  }
}
</script>
