<template>
  <v-navigation-drawer v-model="show" :right="true" temporary fixed>
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
    <v-card v-if="user.name">
      <v-card-title>
        <v-chip>Olá {{ user.name.firstName }}</v-chip>
      </v-card-title>
      <v-card-actions>
        <v-btn flat color="error" @click="logout">Sair</v-btn>
      </v-card-actions>
    </v-card>
    <v-alert v-model="loginError" dismissible type="error">
      Erro ao realizar login! Verifique seu usuário e senha...
    </v-alert>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    user: {},
    username: String,
    password: String,
    rightDrawer: Boolean
  },
  computed: {
    show: {
      get() {
        return this.rightDrawer
      },
      set(value) {
        this.$emit('chanceRightDrawer', value)
      }
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
  methods: {
    login() {
      this.$store.dispatch('login', {
        userName: this.username,
        password: this.password,
        cookie: this.$cookie
      })
    },
    logout() {
      this.$store.dispatch('logout', {
        cookie: this.$cookie
      })
    },
    chanceRightDrawer() {
      this.$emit('chanceRightDrawer', this.rightDrawer)
    }
  }
}
</script>
