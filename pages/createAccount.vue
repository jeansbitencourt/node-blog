<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>
              Cadastro de usuário
            </v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="firstName"
                label="Nome"
                prepend-icon="first_page"
                type="text"
              />

              <v-text-field
                v-model="lastName"
                label="Sobrenome"
                prepend-icon="last_page"
                type="text"
              />

              <v-text-field
                v-model="userName"
                label="Nome de usuário"
                prepend-icon="person"
                type="text"
              />

              <v-text-field
                v-model="email"
                label="Email"
                prepend-icon="email"
                type="text"
              />

              <v-text-field
                v-model="password"
                label="Senha"
                prepend-icon="lock"
                type="password"
              />

              <v-text-field
                v-show="password"
                v-model="passwordConfirm"
                label="Confirme sua senha"
                prepend-icon="lock_open"
                type="password"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="createAccount">
              Criar nova conta
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      firstName: null,
      lastName: null,
      userName: null,
      email: null,
      password: null,
      passwordConfirm: null
    }
  },
  methods: {
    createAccount() {
      if (
        this.password &&
        this.passwordConfirm &&
        this.firstName &&
        this.lastName &&
        this.userName &&
        this.email
      ) {
        if (this.password === this.passwordConfirm) {
          this.$store
            .dispatch('user/create', {
              name: {
                firstName: this.firstName,
                lastName: this.lastName
              },
              userName: this.userName,
              email: this.email,
              password: this.password
            })
            .then(() => {
              this.$toast.success(
                'Conta criada com sucesso! Redirencionando para página inicial...'
              )
              this.$router.push('/')
            })
        } else {
          this.$toast.error(
            'Erro ao criar conta. Senha e confirmação de senha não correspondem'
          )
        }
      } else {
        this.$toast.error(
          'Erro ao criar conta. Verifique se todos os campos estão preenchidos e tente novamente!'
        )
      }
    }
  }
}
</script>
