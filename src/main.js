import { createApp } from "vue"

import App from "./App.vue"
import router from "./router"
import store from "./store"
import BaseComponent from './components/ui/BaseComponent.vue'
import BaseButton from './components/ui/BaseButton.vue'
import BaseDialog from './components/ui/BaseDialog.vue'
import BaseSpinner from './components/ui/BaseSpinner.vue'

const app = createApp(App)

app.use(store)
app.use(router)
app.component('base-component', BaseComponent)
app.component('base-button', BaseButton)
app.component('base-dialog', BaseDialog)
app.component('base-spinner', BaseSpinner)

app.mount("#app")
