<template>
    <Dialog :visible="visible" @update:visible="updateVisible" modal :header="header" :style="{ width: '25rem' }">
        <form @submit.prevent="save">
            <div class="flex flex-col">
                <label for="edit-name">Nombre:</label>
                <input v-model="studyCase.title" id="edit-title" type="text"
                    class="px-4 py-2 border rounded-md focus:ring focus:ring-opacity-50 focus:ring-indigo-300"
                    required />
            </div>

            <div class="flex flex-col">
                <label for="edit-email">Descripción:</label>
                <input v-model="studyCase.description" id="edit-description" type="text"
                    class="px-4 py-2 border rounded-md focus:ring focus:ring-opacity-50 focus:ring-indigo-300" />
            </div>

            <div class="flex justify-end pt-2">
                <button type="button" @click="close"
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
</template>

<script setup lang="ts">
import type { StudyCaseInput, UpdateStudyCaseInput } from '@/types/types';

const props = defineProps<{
    visible: boolean;
    studyCase: StudyCaseInput | UpdateStudyCaseInput;
    header: string;
}>();

const emit = defineEmits(['update:visible', 'save', 'close']);

const updateVisible = (value: boolean) => {
    emit('update:visible', value);
};

const close = () => {
    emit('close');
    emit('update:visible', false);
};

const save = () => {
    emit('save');
};
</script>