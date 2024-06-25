<script setup lang="ts">
import { SEND_MESSAGE } from '@/graphql/mutations/chatMutations';
import { GET_ALL_MESSAGES } from '@/graphql/queries/chatQueries';
import type { Message } from '@/types/types';
import { useMutation, useQuery } from '@vue/apollo-composable';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useToast } from "primevue/usetoast";

const toast = useToast();

const props = defineProps<{
    studyCaseId: number
}>();

const { result: resultMessages, refetch } = useQuery(GET_ALL_MESSAGES, { id: props.studyCaseId });

const messages = computed<Message[]>(() => resultMessages.value?.allMessages || []);
const newMessage = ref('');
const chatContainer = ref<HTMLElement | null>(null);


const { mutate: sendMutation, loading } = useMutation(SEND_MESSAGE);


const sendMessage = async () => {
    if (newMessage.value.trim()) {
        try {
            await sendMutation({
                content: newMessage.value,
                id: props.studyCaseId
            });

            refetch();
            newMessage.value = '';

        } catch (error) {
            toast.add({ severity: 'error', summary: 'Error', detail: error as string, life: 5000 });
        }
    }
};


const scrollToBottom = () => {
    nextTick(() => {
        if (chatContainer.value) {
            chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
        }
    });
};

onMounted(() => {
    scrollToBottom();
});
</script>

<template>
    <div class="flex flex-col h-[calc(100vh-200px)] max-h-[700px] bg-gray-200 rounded">
        <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 flex flex-col-reverse">
            <div v-for="message in [...messages].reverse()" :key="message.id" class="mb-4"
                :class="message.type == 1 ? 'text-right' : 'text-left'">
                <div class="inline-block p-3 rounded-lg max-w-[70%]"
                    :class="message.type == 1 ? 'bg-sky-600 text-white' : 'bg-white text-gray-800'">
                    <p>{{ message.content }}</p>
                    <small class="text-xs opacity-75">
                        {{
                            new Date(message.createdAt).toLocaleTimeString([], {
                                hour: '2-digit', minute: '2-digit'
                            })
                        }}
                    </small>
                </div>
            </div>
        </div>
        <div class="py-4 bg-white">
            <div class="flex">
                <input v-model="newMessage" class="flex-1 mr-2 border p-2 border-gray-400 rounded disabled:bg-slate-200"
                    placeholder="Escribe un mensaje..." @keyup.enter="sendMessage" :disabled="loading" />
                <button @click="sendMessage"
                    class="px-4 py-1 font-medium text-white bg-indigo-600 rounded hover:bg-indigo-500 focus:outline-none disabled:bg-indigo-300"
                    :disabled="loading">
                    
                    <div v-if="!loading">Enviar</div>

                    <div v-else
                        class="mx-3 inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                        role="status">
                        <span
                            class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.flex-col-reverse {
    display: flex;
    flex-direction: column-reverse;
}
</style>