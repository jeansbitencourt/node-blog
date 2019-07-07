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
      <v-toolbar-title v-text="blogName" />
      <v-spacer />
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>menu</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-tile @click.native="right = !right">
          <v-list-tile-action>
            <v-icon light>
              compare_arrows
            </v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }} - {{ blogName }} </span>
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
      right: true,
      rightDrawer: false,
      blogName: this.$store.state.blogName
    }
  },
  computed: {
    categories() {
      return this.$store.state.categories
    }
  },
  created() {
    this.$store.dispatch('loadLinks')
    if (process.client) {
      const cookie = this.$cookie.get('tkUser')
      if (!cookie) {
        this.$store.dispatch('login', {
          userName: 'admin',
          password: 'admin',
          cookie: this.$cookie
        })
      } else {
        this.$store.dispatch('login', { token: cookie })
      }
    }
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
