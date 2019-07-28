<template>
  <v-navigation-drawer v-model="show" :right="true" temporary fixed>
    <v-card v-if="!user.name">
      <v-card-title>
        <v-chip>Fazer login</v-chip>
        <v-text-field
          v-model="username"
          label="Usuário"
          @keyup.enter="requestFocus"
        />
        <v-text-field
          v-model="password"
          :type="'password'"
          label="Senha"
          ref="password"
          @keyup.enter="login"
        />
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
  data() {
    return {
      username: '',
      password: ''
    }
  },
  props: {
    user: {},
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
        return this.$store.state.login.loginError
      },
      set(value) {
        this.$store.commit('login/setLoginError', value)
      }
    }
  },
  methods: {
    login() {
      this.$store.dispatch('login/login', {
        userName: this.username,
        password: this.password,
        cookie: this.$cookie
      })
    },
    logout() {
      this.$store.dispatch('login/logout', {
        cookie: this.$cookie
      })
    },
    chanceRightDrawer() {
      this.$emit('chanceRightDrawer', this.rightDrawer)
    },
    requestFocus() {
      this.$refs.password.focus()
    }
  }
}
</script>
