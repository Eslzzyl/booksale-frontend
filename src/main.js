import { createApp, reactive } from 'vue'
import App from './App.vue'
import router from './router'

import ViewUIPlus from 'view-ui-plus'
import 'view-ui-plus/dist/styles/viewuiplus.css'

const app = createApp(App)

const token = reactive({
    value: ""
})

app.use(router)
app.use(ViewUIPlus)

app.provide('token', token)

app.mount('#app')
