<template>
  <v-navigation-drawer v-model="show" :right="true" temporary fixed>
    <v-card v-if="!user.name">
      <v-card-title>
        <v-chip>Fazer login</v-chip>
        <v-text-field
          v-model="username"
          label="Usuário"
          @keyup.enter="requestFocus"
          @keyup="lowerCaseUserName"
        />
        <v-text-field
          ref="password"
          v-model="password"
          :type="'password'"
          label="Senha"
          @keyup.enter="login"
        />
      </v-card-title>
      <v-card-actions class="justify-center">
        <v-btn color="primary" @click="login">
          Entrar
        </v-btn>
        <v-btn color="primary" to="/createAccount">
          Criar conta
        </v-btn>
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
        <v-btn block color="error" @click="logout">
          Sair
        </v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-btn block color="primary">
          Perfil
        </v-btn>
      </v-card-actions>
      <v-card-actions v-if="user.permissions.createPosts">
        <v-btn
          block
          color="primary"
          :to="'/admin/post/' + this.$store.state.login.userToken + '/list'"
        >
          Postagens
        </v-btn>
      </v-card-actions>
      <v-card-actions v-if="user.permissions.isAdmin">
        <v-btn
          block
          color="primary"
          :to="'/admin/category/' + this.$store.state.login.userToken + '/list'"
        >
          Categorias
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-alert v-model="loginError" dismissible type="error">
      Erro ao realizar login! Verifique seu usuário e senha...
    </v-alert>
    <v-card-actions class="justify-center">
      <v-switch
        class="bottom"
        @change="changeTheme"
        v-model="theme"
        label="Tema branco"
        inset
        color="primary"
        input-value="true"
      />
    </v-card-actions>
  </v-navigation-drawer>
</template>

<style scoped>
.bottom {
  position: absolute;
  bottom: 0;
}
</style>

<script>
import Swal from 'sweetalert2'
export default {
  props: {
    user: Object,
    rightDrawer: Boolean
  },
  data() {
    return {
      username: '',
      password: ''
    }
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
    },
    theme: {
      get() {
        return this.$cookies ? this.$cookies.whiteTheme === 'true' : false
      },
      set(value) {
        this.$setCookie('whiteTheme', value, { expires: 365 })
      }
    }
  },
  mounted() {
    this.changeTheme()
    const loginParams = window.location.search.split('logout=')
    if (loginParams[1]) {
      Swal.fire({
        title: 'Oops',
        text: 'Sua sessão expirou!',
        type: 'warning',
        confirmButtonText: 'Ok'
      }).then((result) => {
        this.$store.dispatch('login/logout', {
          cookie: this.$cookie,
          router: this.$router,
          path: loginParams[0]
        })
      })
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
    },
    lowerCaseUserName() {
      this.username = this.username ? this.username.toLowerCase() : null
    },
    changeTheme() {
      this.$vuetify.theme.dark = !this.theme

      const title = document.getElementsByClassName('blog-title')[0]

      if (!this.theme) {
        title.classList.add('white--text')
        title.classList.remove('black--text')
      } else {
        title.classList.add('black--text')
        title.classList.remove('white--text')
        const style = document.createElement('style')
        style.type = 'text/css'
        style.innerHTML =
          'pre.prettyprint, code.prettyprint { color: #fff !important; }'
        document.getElementsByTagName('head')[0].appendChild(style)
      }
    }
  }
}
</script>
