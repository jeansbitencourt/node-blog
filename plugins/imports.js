import Vue from 'vue'
import Vuetify, { VSnackbar } from 'vuetify/lib'
import VuetifyToast from 'vuetify-toast-snackbar'
import VueTrumbowyg from 'vue-trumbowyg'
import 'trumbowyg/dist/ui/trumbowyg.css'
import CodePrettify from 'code-prettify'
import 'code-prettify/styles/sunburst.css'

const WOW = require('wowjs')
window.wow = new WOW.WOW({
  live: true
})

Vue.use(Vuetify, {
  components: {
    VSnackbar
  }
})

Vue.use(VuetifyToast)

Vue.use(VueTrumbowyg)

Vue.use(CodePrettify)
