import './assets/main.css'

import App from './App.vue'
import { createApp, h, provide } from 'vue'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core';
import { DefaultApolloClient, provideApolloClient } from '@vue/apollo-composable';
import router from './router';
import DashboardLayout from './components/DashboardLayout.vue';
import EmptyLayout from './components/EmptyLayout.vue';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';

import {
    faUserSecret, faDashboard, faUsers, faTable, faSearch, faTrash, faPen, faUserPlus,
    faRobot, faFile, faCircleInfo, faUpload
} from '@fortawesome/free-solid-svg-icons'

import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import Dialog from 'primevue/dialog';
import DialogService from 'primevue/dialogservice'
import { setContext } from '@apollo/client/link/context';
import { useUserStore } from './stores/user';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import Ripple from 'primevue/ripple';
import FileUpload from 'primevue/fileupload';

library.add(faUserSecret, faDashboard, faUsers, faTable, faSearch, faTrash,
    faPen, faUserPlus, faRobot, faFile, faCircleInfo, faUpload)


const httpLink = createHttpLink({
    uri: "http://127.0.0.1:8000/graphql",
});


const authLink = setContext((_, { headers }) => {
    const userStore = useUserStore();
    const token = userStore.getToken;

    return {
        headers: {
            ...headers,
            authorization: token ? `JWT ${token}` : "",
        }
    };
});


const cache = new InMemoryCache();

export const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: cache,
});


const app = createApp({
    setup() {
        provide(DefaultApolloClient, apolloClient)
    },
    render: () => h(App),
})


app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '' // Esto debería evitar que se generen reglas CSS para el modo oscuro
        }
    }
});

app.use(ToastService);
app.use(ConfirmationService);
app.use(DialogService);
app.directive('ripple', Ripple);
app.component('TabPanels', TabPanels);
app.component('TabPanel', TabPanel);
app.component('Toast', Toast);
app.component('Dialog', Dialog);
app.component('Tabs', Tabs);
app.component('TabList', TabList);
app.component('Tab', Tab);
app.component('FileUpload', FileUpload);

app.component('DefaultLayout', DashboardLayout)
    .component('EmptyLayout', EmptyLayout)
    .component("font-awesome-icon", FontAwesomeIcon)

app.use(router).use(createPinia()).mount('#app');
