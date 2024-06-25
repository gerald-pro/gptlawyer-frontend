<script setup lang="ts">
import { useMutation, useQuery } from '@vue/apollo-composable';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import DocumentsManager from '@/components/DocumentsManager.vue';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { GET_STUDY_CASE } from '@/graphql/queries/studyCaseQueries';
import type { StudyCase, UpdateStudyCaseInput } from '@/types/types';
import { PROCESS_STUDY_CASE, DELETE_STUDY_CASE, UPDATE_STUDY_CASE } from '@/graphql/mutations/studyCaseMutations';
import StudyCaseDialog from '@/components/StudyCaseDialog.vue';
import ChatBox from '@/components/ChatBox.vue';
import router from '@/router';

const route = useRoute();
const studyCaseId = ref(parseInt(route.params.id as string));

const { result, refetch } = useQuery(GET_STUDY_CASE, { id: studyCaseId.value });

const { mutate: deleteSCMutation } = useMutation(DELETE_STUDY_CASE);
const { mutate: processSCMutation, loading } = useMutation(PROCESS_STUDY_CASE);

const updatedStudyCase = ref<UpdateStudyCaseInput>({ id: '', description: '' });

const studyCase = computed<StudyCase>(() => {
    updatedStudyCase.value = { ...result.value?.studyCase };
    return result.value?.studyCase || []
});

const { mutate: updateSCMutation } = useMutation(UPDATE_STUDY_CASE);

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

const visibleUpdateDialog = ref(false);


const closeUpdateStudyCaseDialog = () => {
    visibleUpdateDialog.value = false;
};

const handleUpdateStudyCase = async () => {
    try {
        await updateSCMutation({ ...updatedStudyCase.value });
        refetch();
        toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Caso de estudio actualizado correctamente', life: 3000 });
        closeUpdateStudyCaseDialog();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error, life: 5000 });
    }
};

const handleDeleteStudyCase = () => {
    confirm.require({
        message: '¿Estás seguro? Esta acción es irreversible',
        header: 'Eliminar',
        rejectProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
        acceptProps: { label: 'Eliminar', severity: 'danger' },
        accept: async () => {
            try {
                await deleteSCMutation({ id: studyCaseId.value });
                router.push({ name: "StudyCases" });
            } catch (error) {
                toast.add({ severity: 'error', summary: 'Error', detail: error, life: 5000 });
            }
        }
    });
};

const handleProcessStudyCase = async () => {
    try {
        // Ejecuta la mutación con el ID del caso de estudio
        await processSCMutation({ id: studyCaseId.value });
        refetch();
        toast.add({ severity: 'success', summary: 'Procesado', detail: 'Caso de estudio procesado correctamente', life: 3000 });

    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error as string, life: 5000 });
    }
};

</script>

<template>
    <div>
        <Toast />
        <ConfirmDialog />

        <div class=" bg-white shadow-lg rounded-lg overflow-hidden">
            <div class="px-6 py-3">

                <div class="flex justify-between text-gray-700">
                    <div>
                        <h1 class="text-lg font-bold  uppercase">{{ studyCase.title }}</h1>
                        <p class="font-medium ">Caso de estudio</p>
                    </div>
                    <div class="my-auto space-x-4">
                        <button label="refresh" outlined @click="handleProcessStudyCase" :disabled="loading">
                           
                            <div v-if="!loading"><font-awesome-icon icon="arrows-rotate" /></div>

                            <div v-else
                                class="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                role="status">
                                <span
                                    class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                            </div>
                        </button>
<!-- 
                        <button label="Editar" outlined>
                            <font-awesome-icon icon="user-plus" />
                        </button>
 -->
                        <button label="Editar" outlined @click="visibleUpdateDialog = true">
                            <font-awesome-icon icon="pen" />
                        </button>

                        <button label="Eliminar" outlined @click="handleDeleteStudyCase">
                            <font-awesome-icon icon="trash" />
                        </button>
                    </div>
                </div>
                <div class="flex justify-between">
                    <div>
                        <p class="text-sm text-gray-600">{{ studyCase.description }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Creado: {{ formatDate(studyCase.createdAt) }}</p>
                    </div>
                </div>
            </div>

            <StudyCaseDialog v-model:visible="visibleUpdateDialog" :studyCase="updatedStudyCase"
                @save="handleUpdateStudyCase" header="Editar caso de estudio" @close="closeUpdateStudyCaseDialog" />
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
                            <div v-html="studyCase.content"></div>

                        </TabPanel>
                        <TabPanel value="1">
                            <p class="m-0">
                                <ChatBox :studyCaseId="studyCaseId" />
                            </p>
                        </TabPanel>
                        <TabPanel value="2">
                            <DocumentsManager :studyCaseId="studyCaseId" />
                        </TabPanel>
                    </div>
                </TabPanels>
            </Tabs>
        </div>
    </div>
</template>