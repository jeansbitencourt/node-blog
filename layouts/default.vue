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
      <v-layout>
        <nuxt />
      </v-layout>
    </v-content>
    <RightBar
      :rightDrawer="rightDrawer"
      :user="user"
      @chanceRightDrawer="rightDrawer = $event"
    />
    <v-footer :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }} - {{ blogName }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import RightBar from '~/components/RightBar.vue'
export default {
  components: {
    RightBar
  },
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: true,
      miniVariant: false,
      rightDrawer: false,
      blogName: this.$store.state.blogName,
      search: ''
    }
  },
  computed: {
    categories() {
      return this.$store.state.category.categories
    },
    user() {
      return this.$store.state.login.userData
    }
  },
  mounted() {
    const cookieTk = this.$cookie.get('tkUser')
    const cookieUser = this.$cookie.get('dtUser')
    if (cookieTk && cookieUser) {
      this.$store.dispatch('login/login', { token: cookieTk, user: cookieUser })
    }
    $(document).ready(() => {
      alert('oi')
    })
  },
  methods: {
    ucFirst(word) {
      return word.charAt(0).toUpperCase() + word.slice(1)
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
