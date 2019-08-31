import Vue from 'vue'
import Vuetify, { VSnackbar } from 'vuetify/lib'
import VuetifyToast from 'vuetify-toast-snackbar'
import VueTrumbowyg from 'vue-trumbowyg'
import 'trumbowyg/dist/ui/trumbowyg.css'

Vue.use(Vuetify, {
  components: {
    VSnackbar
  }
})

Vue.use(VuetifyToast)

Vue.use(VueTrumbowyg)
