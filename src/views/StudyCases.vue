<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { useMutation, useQuery } from '@vue/apollo-composable';
import debounce from 'lodash.debounce';
import { CREATE_STUDY_CASE, DELETE_STUDY_CASE, UPDATE_STUDY_CASE } from '@/graphql/mutations/studyCaseMutations';
import { GET_ALL_STUDY_CASES } from '@/graphql/queries/studyCaseQueries';
import type { StudyCase, StudyCaseInput, UpdateStudyCaseInput } from '@/types/types';
import StudyCaseDialog from '@/components/StudyCaseDialog.vue';

// Utils
const formatDate = (value: any) => {
  return new Date(value).toLocaleDateString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Hooks
const confirm = useConfirm();
const toast = useToast();

// State
const visibleCreateDialog = ref(false);
const visibleUpdateDialog = ref(false);
const createStudyCase = ref<StudyCaseInput>({ title: '', description: '' });
const updateStudyCase = ref<UpdateStudyCaseInput>({ id: '', title: '', description: '' });
const globalSearch = ref('');

// GraphQL Queries and Mutations
const { result, loading, error, refetch } = useQuery(GET_ALL_STUDY_CASES,
  { globalSearch: globalSearch.value },
  { fetchPolicy: 'cache-and-network' }
);
const { mutate: createMutation } = useMutation(CREATE_STUDY_CASE);
const { mutate: updateMutation } = useMutation(UPDATE_STUDY_CASE);
const { mutate: deleteMutation } = useMutation(DELETE_STUDY_CASE);

// Computed
const studyCases = computed<StudyCase[]>(() => result.value?.allStudyCases || []);

// Watchers
const search = debounce((globalSearch: string) => {
  refetch({ globalSearch: globalSearch });
}, 500);

watch(globalSearch, search);
watch(error, (errorValue) => {
  if (errorValue) {
    toast.add({ severity: 'error', summary: 'Error', detail: errorValue.message, life: 5000 });
  }
});

// Methods
const openUpdateDialog = (data: UpdateStudyCaseInput) => {
  visibleUpdateDialog.value = true;
  updateStudyCase.value = { id: data.id, title: data.title, description: data.description };
};

const closeUpdateDialog = () => {
  updateStudyCase.value = { id: '', title: '', description: '' };
  visibleUpdateDialog.value = false;
};

const handleCreate = async () => {
  try {
    await createMutation({ ...createStudyCase.value });
    createStudyCase.value = { title: '', description: '' };
    refetch();
    toast.add({ severity: 'success', summary: 'Creado', detail: 'Caso de estudio creado correctamente', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: error, life: 5000 });
  } finally {
    visibleCreateDialog.value = false;
  }
};

const handleUpdate = async () => {
  try {
    await updateMutation({ ...updateStudyCase.value });
    refetch();
    toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Caso de estudio actualizado correctamente', life: 3000 });
    closeUpdateDialog();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: error, life: 5000 });
  }
};

const handleDelete = (id: number) => {
  confirm.require({
    message: '¿Estás seguro? Esta acción es irreversible',
    header: 'Eliminar',
    rejectProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
    acceptProps: { label: 'Eliminar', severity: 'danger' },
    accept: async () => {
      try {
        await deleteMutation({ id: id });
        refetch();
        toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Caso de estudio eliminado correctamente', life: 3000 });
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error, life: 5000 });
      }
    }
  });
};
</script>

<template>
  <div>
    <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-0 lg:-mx-8 lg:px-8">
      <div class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
        <Toast />
        <ConfirmDialog />

        <DataTable :value="studyCases" stripedRows removableSort size="normal" paginator :rows="10" :loading="loading"
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          :globalFilterFields="['title', 'description']"
          currentPageReportTemplate="{first} a {last} de {totalRecords} registros">
          <template #loading> Cargando datos... </template>
          <template #header>
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex flex-wrap space-x-4">
                <span class="text-xl font-bold">Casos de estudio</span>
                <button @click="visibleCreateDialog = true"
                  class="px-4 py-1 font-medium text-white bg-indigo-600 rounded hover:bg-indigo-500 focus:outline-none">Crear</button>
              </div>

              <div class="relative flex flex-wrap items-stretch">
                <span
                  class="flex items-center whitespace-nowrap rounded-s border border-e-0 border-solid border-gray-400 px-3 py-[0.25rem] text-center text-base font-normal leading-[1.6] text-surface"
                  id="basic-addon1">
                  <font-awesome-icon icon="search" />
                </span>
                <input type="text" class="border p-1 border-gray-400 relative m-0 block flex-auto rounded-e"
                  placeholder="Buscar..." v-model="globalSearch">
              </div>
            </div>
          </template>
          <Column field="id" header="ID"></Column>
          <Column field="title" header="Título" sortable>
            <template #body="{ data }">
              <router-link :to="{ name: 'StudyCase', params: { id: data.id } }" class="text-teal-500 hover:underline">{{
                data.title }}</router-link>
            </template>
          </Column>
          <Column field="description" header="Descripción"></Column>
          <Column field="createdAt" header="Creado" sortable dataType="date">
            <template #body="{ data }">
              {{ formatDate(data.createdAt) }}
            </template>
          </Column>
          <Column header="Opciones">
            <template #body="{ data }">
              <div class="space-x-5">
                <button @click="handleDelete(data.id)" label="Eliminar" outlined>
                  <font-awesome-icon icon="trash" />
                </button>
                <button @click="openUpdateDialog(data)" label="Editar" outlined>
                  <font-awesome-icon icon="pen" />
                </button>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>

  <StudyCaseDialog v-model:visible="visibleCreateDialog" :studyCase="createStudyCase" @save="handleCreate"
    header="Crear caso de estudio" />
  <StudyCaseDialog v-model:visible="visibleUpdateDialog" :studyCase="updateStudyCase" @save="handleUpdate"
    header="Editar caso de estudio" @close="closeUpdateDialog" />
</template>