<script setup lang="ts">
import { ref } from 'vue'
import { useSidebar } from '../composables/useSidebar'

const { isOpen } = useSidebar()
const activeClass = ref(
  'bg-gray-600 bg-opacity-25 text-gray-100 border-gray-100',
)
const inactiveClass = ref(
  'border-gray-900 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100',
)
</script>

<template>
  <div class="flex">
    <!-- Backdrop -->
    <div :class="isOpen ? 'block' : 'hidden'"
      class="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden" @click="isOpen = false" />
    <!-- End Backdrop -->

    <div :class="isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'"
      class="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-gray-900 lg:translate-x-0 lg:static lg:inset-0">
      <div class="flex items-center justify-center mt-8">
        <div class="flex items-center">
          <img src="../assets/gpt_lawyer2.png" width="180px">
        </div>
      </div>

      <nav class="mt-10">
        <router-link class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Dashboard' ? activeClass : inactiveClass]" to="/">
          <font-awesome-icon icon="dashboard" />

          <span class="mx-4">Dashboard</span>
        </router-link>

        <router-link class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name == 'StudyCases' ? activeClass : inactiveClass]" to="/study-cases">
          <font-awesome-icon icon="scale-balanced" />
          <span class="mx-4">Casos de estudio</span>
        </router-link>

        <router-link class="flex items-center px-6 py-2 mt-4 duration-200 border-l-4"
          :class="[$route.name === 'Users' ? activeClass : inactiveClass]" to="/users">
          <font-awesome-icon icon="users" />
          <span class="mx-4">Usuarios</span>
        </router-link>

      </nav>
    </div>
  </div>
</template>
