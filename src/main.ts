import './assets/main.css'
import App from './App.vue'
import DashboardLayout from './components/DashboardLayout.vue';
import EmptyLayout from './components/EmptyLayout.vue';

// Importaciones de Vue y Apollo
import { createApp, h, provide } from 'vue'
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { setContext } from '@apollo/client/link/context';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';

// Importaciones de enrutador y estado
import router from './router';
import { createPinia } from 'pinia';
import { useUserStore } from './stores/user';

// Importaciones de PrimeVue y sus servicios
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import Dialog from 'primevue/dialog';
import DialogService from 'primevue/dialogservice'
import Ripple from 'primevue/ripple';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import FileUpload from 'primevue/fileupload';
import Textarea from 'primevue/textarea';

// Importaciones de FontAwesome
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faUserSecret, faDashboard, faUsers, faTable, faSearch, faTrash, faPen, faUserPlus,
    faRobot, faFile, faCircleInfo, faUpload,faArrowsRotate
} from '@fortawesome/free-solid-svg-icons'
import { apolloClient } from './apollo-config';


// Configuración de FontAwesome
library.add(
    faUserSecret, faDashboard, faUsers, faTable, faSearch, faTrash,
    faPen, faUserPlus, faRobot, faFile, faCircleInfo, faUpload,faArrowsRotate
)


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
            darkModeSelector: ''
        }
    }
});

app.use(ToastService)
    .use(ConfirmationService)
    .use(DialogService);
app.directive('ripple', Ripple);

app.component('TabPanels', TabPanels)
    .component('TabPanel', TabPanel)
    .component('Toast', Toast)
    .component('Dialog', Dialog)
    .component('Tabs', Tabs)
    .component('TabList', TabList)
    .component('Tab', Tab)
    .component('FileUpload', FileUpload)
    .component('Textarea', Textarea)
    .component('DefaultLayout', DashboardLayout)
    .component('EmptyLayout', EmptyLayout)
    .component("font-awesome-icon", FontAwesomeIcon)

app.use(router).use(createPinia()).mount('#app');
