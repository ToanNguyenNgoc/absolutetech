import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '@/assets/css/global.css';
import print from 'vue3-print-nb'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';

const app = createApp(App);

app.use(router);
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(ElementPlus);
app.use(print)
//
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: 3600 * 10 * 10,
    },
  },
});
app.use(VueQueryPlugin, {
  queryClient,
})
//
app.mount('#app');
