<template>
    <div class="message p-4 rounded-lg max-w-xs my-2">
        <h5 class="font-bold">{{ author }}</h5>
        <p>{{ content }}</p>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
    author: String,
    content: String
})
</script>