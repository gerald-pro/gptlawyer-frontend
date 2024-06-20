<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMutation, useQuery } from '@vue/apollo-composable';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import FileUpload from 'primevue/fileupload';
import Textarea from 'primevue/textarea';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { GET_DOCUMENTS_BY_STUDY_CASE } from '@/graphql/queries/documentQueries';
import { DELETE_DOCUMENT, UPDATE_DOCUMENT, UPLOAD_DOCUMENT } from '@/graphql/mutations/documentMutations';
import type { Document } from '@/types/types';
import type { FileUploadUploaderEvent } from 'primevue/fileupload';

const props = defineProps<{
    studyCaseId: number
}>();

const { result: resultDocs, loading: loadingDocs, refetch: refetchDocs } = useQuery(GET_DOCUMENTS_BY_STUDY_CASE, { id: props.studyCaseId });

const { mutate: uploadDocMutation } = useMutation(UPLOAD_DOCUMENT);
const { mutate: deleteDocMutation } = useMutation(DELETE_DOCUMENT);
const { mutate: updateDocMutation } = useMutation(UPDATE_DOCUMENT);

const docs = computed<Document[]>(() => resultDocs.value?.documentsByStudyCase || []);
const updatedDocument = ref<Document>({ id: 0, name: '', studyCaseId: props.studyCaseId, content: '' });

const confirm = useConfirm();
const toast = useToast();

const visibleUploadDialog = ref(false);
const visibleUpdateDocDialog = ref(false);

const formatDate = (value: any) => {
    return new Date(value).toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const openUpdateDocDialog = (data: Document) => {
    visibleUpdateDocDialog.value = true;
    updatedDocument.value = { ...data };
};

const handleFileUpload = async (event: FileUploadUploaderEvent) => {
    const files: File[] = Array.isArray(event.files) ? event.files : [event.files];
    visibleUploadDialog.value = false;
    loadingDocs.value = true;
    for (const file of files) {
        try {
            await uploadDocMutation({
                file: file,
                studyCaseId: props.studyCaseId
            });
            toast.add({ severity: 'success', summary: 'Archivo cargado', detail: 'Documento ' + file.name + ' cargado exitosamente', life: 3000 });
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Error', detail: error as string, life: 5000 });
        }
    }
    refetchDocs();
};

const handleUpdateDoc = async () => {
    try {
        await updateDocMutation({ ...updatedDocument.value });
        refetchDocs();
        toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Documento actualizado correctamente', life: 3000 });
        visibleUpdateDocDialog.value = false;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error as string, life: 5000 });
    }
};

const handleDeleteDoc = (id: number) => {
    confirm.require({
        message: '¿Estás seguro? Esta acción es irreversible',
        header: 'Eliminar',
        rejectProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
        acceptProps: { label: 'Eliminar', severity: 'danger' },
        accept: async () => {
            try {
                await deleteDocMutation({ id: id });
                refetchDocs();
                toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Documento eliminado correctamente', life: 3000 });
            } catch (error) {
                toast.add({ severity: 'error', summary: 'Error', detail: error as string, life: 5000 });
            }
        }
    });
};
</script>

<template>
    <div>
        <DataTable :value="docs" stripedRows removableSort size="small" paginator :rows="10" :loading="loadingDocs"
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            :globalFilterFields="['title', 'description']"
            currentPageReportTemplate="{first} a {last} de {totalRecords} registros">
            <template #loading> Cargando datos... </template>
            <template #header>
                <div class="flex flex-wrap items-center justify-end gap-2 -mt-1 mb-3">
                    <div class="flex flex-wrap space-x-4">
                        <button @click="visibleUploadDialog = true"
                            class="px-4 py-1 font-medium text-indigo-600 rounded hover:bg-gray-200 focus:outline-none border border-indigo-400">
                            <font-awesome-icon icon="upload" />
                        </button>
                    </div>
                </div>
            </template>
            <Column field="name" header="Nombre" sortable></Column>
            <Column header="Tipo">
                <template #body="{ data }">
                    {{ data.contentType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ?
                        ".docx" : data.contentType }}
                </template>
            </Column>
            <Column field="uploadedBy.username" header="Usuario" sortable></Column>
            <Column field="uploadedAt" header="Subido" sortable dataType="date">
                <template #body="{ data }">
                    {{ formatDate(data.uploadedAt) }}
                </template>
            </Column>
            <Column header="Opciones">
                <template #body="{ data }">
                    <div class="space-x-5">
                        <button label="Editar" outlined @click="openUpdateDocDialog(data)">
                            <font-awesome-icon icon="pen" />
                        </button>
                        <button label="Eliminar" outlined @click="handleDeleteDoc(data.id)">
                            <font-awesome-icon icon="trash" />
                        </button>
                    </div>
                </template>
            </Column>
        </DataTable>

        <Dialog :style="{ width: '55rem' }" v-model:visible="visibleUpdateDocDialog" header="Editar documento">
            <form @submit.prevent="handleUpdateDoc" class="space-y-2">
                <div class="flex flex-col">
                    <label for="edit-doc-name">Nombre:</label>
                    <input v-model="updatedDocument.name" id="edit-doc-name" type="text"
                        class="px-4 py-2 border rounded-md focus:ring focus:ring-opacity-50 focus:ring-indigo-300"
                        required />
                </div>
                <div class="flex flex-col">
                    <label for="edit-content">Contenido:</label>
                    <Textarea v-model="updatedDocument.content" rows="15" cols="50" />
                </div>
                <div class="flex justify-end pt-2">
                    <button type="button" @click="visibleUpdateDocDialog = false"
                        class="px-6 py-2 mr-2 text-indigo-500 bg-transparent rounded-lg hover:bg-gray-100 hover:text-indigo-400 focus:outline-none">
                        Cancelar
                    </button>
                    <button type="submit"
                        class="px-6 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none">
                        Guardar
                    </button>
                </div>
            </form>
        </Dialog>

        <Dialog v-model:visible="visibleUploadDialog" modal header="Subir archivos" :style="{ width: '25rem' }">
            <FileUpload name="files" @uploader="handleFileUpload" :customUpload="true" :multiple="true"
                :disabled="loadingDocs" chooseLabel="Elegir" uploadLabel="Subir" cancelLabel="Cancelar"
                accept="image/jpeg, image/png, .pdf, .docx" :maxFileSize="1000000">
                <template #empty>
                    <span>Arrasta los documentos aquí para subirlos.</span>
                </template>
            </FileUpload>
        </Dialog>
    </div>
</template>