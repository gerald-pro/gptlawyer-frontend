<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { GET_STUDY_CASE } from '@/graphql/queries/studyCaseQueries';
import type { StudyCase } from '@/types/types';


const route = useRoute();
const studyCaseId = ref(parseInt(route.params.id as string));
const { result, loading, error } = useQuery(GET_STUDY_CASE, { studyCaseId });

const docs = ref<Document[]>([]);
const studyCase = computed<StudyCase>(() => {
    console.log(docs.value);
    docs.value = result.value?.studyCase.documentSet; return result.value?.studyCase || []
});

const searchDoc = ref('');

const formatDate = (value: any) => {
    return new Date(value).toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const confirm = useConfirm();
const toast = useToast();

const visibleUploadDialog = ref(false);
const visibleEditDialog = ref(false);

const openUlpoadDialog = () => {
    visibleUploadDialog.value = true;
}

const closeUlpoadDialog = () => {
    visibleUploadDialog.value = false;
}


const onAdvancedUpload = () => {
    toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};
</script>

<template>
    <div>
        <div class=" bg-white shadow-lg rounded-lg overflow-hidden">
            <div class="px-6 py-3">

                <div class="flex justify-between text-gray-700">
                    <div>
                        <h1 class="text-xl font-bold ">{{ studyCase.title }}</h1>
                        <p class="font-medium ">Caso de estudio</p>
                    </div>
                    <div class="my-auto space-x-4">
                        <button label="Editar" outlined>
                            <font-awesome-icon icon="user-plus" />
                        </button>

                        <button label="Editar" outlined>
                            <font-awesome-icon icon="pen" />
                        </button>

                        <button label="Eliminar" outlined>
                            <font-awesome-icon icon="trash" />
                        </button>
                    </div>
                </div>
                <div class="flex justify-left">
                    <div>
                        <p class="text-sm text-gray-600">Creado: {{ formatDate(studyCase.createdAt) }}</p>
                    </div>
                </div>
            </div>

        </div>
        <div class="pt-4 shadow-lg rounded-lg">
            <Tabs value="0">
                <TabList>
                    <div class="grid grid-cols-3 items-center justify-between w-full">
                        <Tab value="0">
                            <div class="-my-1"><font-awesome-icon icon="circle-info" class="px-2" />Contexto</div>
                        </Tab>
                        <Tab value="1">
                            <div class="-my-1"><font-awesome-icon icon="robot" class="px-2" />Asistente</div>
                        </Tab>
                        <Tab value="2">
                            <div class="-my-1"><font-awesome-icon icon="file" class="px-2" />Documentos</div>
                        </Tab>
                    </div>
                </TabList>

                <TabPanels>
                    <div class="min-h-80">
                        <TabPanel value="0">
                            <p class="m-0">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut
                                labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                                ullamco
                                laboris nisi ut aliquip ex ea commodo
                                consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                                eu
                                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                                officia deserunt mollit anim id est laborum.
                            </p>
                        </TabPanel>
                        <TabPanel value="1">
                            <p class="m-0">
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                                laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                                architecto beatae vitae dicta sunt explicabo. Nemo enim
                                ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur
                                magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit,
                                sed
                                quia non numquam eius modi.
                            </p>
                        </TabPanel>
                        <TabPanel value="2">
                            <DataTable :value="docs" stripedRows removableSort size="small" paginator :rows="10"
                                :loading="loading"
                                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                :globalFilterFields="['title', 'description']"
                                currentPageReportTemplate="{first} a {last} de {totalRecords} registros">
                                <template #loading> Cargando datos... </template>
                                <template #header>
                                    <div class="flex flex-wrap items-center justify-between gap-2 -mt-1 mb-3">
                                        <div class="relative flex flex-wrap items-stretch">
                                            <span
                                                class="flex items-center whitespace-nowrap rounded-s border border-e-0 border-solid border-gray-400 px-3 py-[0.25rem] text-center text-base font-normal leading-[1.6] text-surface"
                                                id="basic-addon1">
                                                <font-awesome-icon icon="search" />
                                            </span>
                                            <input type="text"
                                                class="border p-1 border-gray-400 relative m-0 block flex-auto rounded-e"
                                                placeholder="buscar..." v-model="searchDoc">
                                        </div>
                                        <div class="flex flex-wrap space-x-4">
                                            <button @click="visibleUploadDialog = true"
                                                class="px-4 py-1 font-medium text-indigo-600  rounded hover:bg-gray-200 focus:outline-none border border-indigo-400"><font-awesome-icon
                                                    icon="upload" />
                                            </button>
                                        </div>
                                    </div>
                                </template>
                                <Column field="id" header="#"></Column>
                                <Column field="name" header="Nombre" sortable></Column>
                                <Column field="uploadedAt" header="Subido" sortable dataType="date">
                                    <template #body="{ data }">
                                        {{ formatDate(data.uploadedAt) }}
                                    </template>
                                </Column>
                                <Column field="uploadedBy.username" header="Colaborador" sortable></Column>
                                <Column header="Opciones">
                                    <template #body="{ data }">
                                        <div class="space-x-5">
                                            <button label="Eliminar" outlined>
                                                <font-awesome-icon icon="trash" />
                                            </button>
                                            <button label="Editar" outlined>
                                                <font-awesome-icon icon="pen" />
                                            </button>
                                        </div>
                                    </template>
                                </Column>
                            </DataTable>
                        </TabPanel>
                    </div>
                </TabPanels>
            </Tabs>
        </div>

        <Dialog v-model:visible="visibleUploadDialog" modal header="Subir archivos" :style="{ width: '25rem' }">
            <FileUpload name="demo[]" url="/api/upload" @upload="onAdvancedUpload($event)" :multiple="true"
                accept="image/*" :maxFileSize="1000000">
                <template #empty>
                    <span>Drag and drop files to here to upload.</span>
                </template>
            </FileUpload>
        </Dialog>
    </div>
</template>