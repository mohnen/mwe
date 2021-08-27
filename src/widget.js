import { createApp } from 'vue'
import Widget from './Widget.vue'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'

createApp(Widget).use(Quasar, quasarUserOptions).mount('#widget')
