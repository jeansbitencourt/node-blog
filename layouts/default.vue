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
        <v-list-item
          v-for="(category, i) in categories"
          :key="i"
          :to="category.route"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ category.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="ucFirst(category.name)" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-btn v-show="drawer" icon @click.stop="miniVariant = !miniVariant">
        <v-icon>{{ `chevron_${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <nuxt-link to="/" class="no-text-decoration">
        <v-toolbar-title
          class="white--text"
          v-text="blogName + (user.name ? ' - Olá ' + user.name.firstName : '')"
        />
      </nuxt-link>
      <v-spacer />
      <SearchBar v-if="searchTopBar" />
      <v-btn
        icon
        style="margin-left:3em"
        @click.stop="rightDrawer = !rightDrawer"
      >
        <v-icon>menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-layout>
        <nuxt />
      </v-layout>
    </v-content>
    <RightBar
      :right-drawer="rightDrawer"
      :user="user"
      @chanceRightDrawer="rightDrawer = $event"
    />
    <v-footer :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }} - {{ blogName }}</span>
    </v-footer>
  </v-app>
</template>

<style>
.no-text-decoration {
  text-decoration: none;
  color: #fff;
}
</style>

<script>
import RightBar from '~/components/RightBar.vue'
import SearchBar from '~/components/SearchBar.vue'
function isMobile() {
  return (
    typeof window.orientation !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1
  )
}
export default {
  components: {
    RightBar,
    SearchBar
  },
  data() {
    return {
      clipped: true,
      drawer: true,
      searchTopBar: true,
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
  created() {
    this.changeToMobile()
  },
  mounted() {
    const cookieTk = this.$cookie.get('tkUser')
    const cookieUser = this.$cookie.get('dtUser')
    if (cookieTk && cookieUser) {
      this.$store.dispatch('login/login', { token: cookieTk, user: cookieUser })
    }
  },
  methods: {
    ucFirst(word) {
      return word.charAt(0).toUpperCase() + word.slice(1)
    },
    changeToMobile() {
      if (process.client && isMobile()) {
        this.drawer = false
        this.searchTopBar = false
      }
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
