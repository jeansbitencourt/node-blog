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
        <v-btn text color="primary" @click="login">Entrar</v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-if="user.name">
      <v-card-title class="justify-center">
        <v-chip pill>
          <v-avatar left color="red">
            {{ user.name.firstName.substring(0, 1) }}
          </v-avatar>
          Seja bem-vindo {{ user.name.firstName }}
        </v-chip>
      </v-card-title>
      <v-card-actions>
        <v-btn block color="error" @click="logout">Sair</v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-btn block color="primary">Perfil</v-btn>
      </v-card-actions>
      <v-card-actions v-if="user.permissions.createPosts">
        <v-btn
          block
          color="primary"
          :to="'/admin/post/' + this.$store.state.login.userToken + '/list'"
          >Postagens
        </v-btn>
      </v-card-actions>
      <v-card-actions v-if="user.permissions.isAdmin">
        <v-btn
          block
          color="primary"
          :to="'/admin/category/' + this.$store.state.login.userToken + '/list'"
          >Categorias
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-alert v-model="loginError" dismissible type="error">
      Erro ao realizar login! Verifique seu usuário e senha...
    </v-alert>
  </v-navigation-drawer>
</template>

<script>
import Swal from 'sweetalert2'
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
        return this.$store.state.login.loginError != null
      },
      set(value) {
        this.$store.commit('login/setLoginError', null)
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
      Swal.fire({
        title: 'Tem certeza?',
        text: 'Você tem certeza que deseja sair?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, quero sair!',
        cancelButtonText: 'Não'
      }).then((result) => {
        if (result.value) {
          this.username = ''
          this.password = ''
          this.$store.dispatch('login/logout', {
            cookie: this.$cookie,
            router: this.$router
          })
        }
      })
    },
    chanceRightDrawer() {
      this.$emit('chanceRightDrawer', this.rightDrawer)
    },
    requestFocus() {
      this.$refs.password.focus()
    }
  },
  mounted() {
    const login = window.location.search.split('logout=')[1]
    if (login) {
      Swal.fire({
        title: 'Oops',
        text: 'Sua sessão expirou!',
        type: 'warning',
        confirmButtonText: 'Ok'
      }).then((result) => {
        this.$store.dispatch('login/logout', {
          cookie: this.$cookie,
          router: this.$router
        })
      })
    }
  }
}
</script>
