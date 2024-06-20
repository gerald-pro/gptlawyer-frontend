<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useMutation } from '@vue/apollo-composable';
import { USER_SIGNIN } from '@/mutations';
import type { FetchResult } from '@apollo/client';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const signInDetails = ref({
  username: '',
  password: ''
});

const errorMessage = ref<string | null>(null);
const isLoading = ref(false);
const { mutate: userSignInMutation } = useMutation(USER_SIGNIN);

const userSignIn = async () => {
  errorMessage.value = null;
  isLoading.value = true;

  try {
    const result: FetchResult<any, Record<string, any>, Record<string, any>> | null = await userSignInMutation({
      username: signInDetails.value.username,
      password: signInDetails.value.password,
    });

    if (result && result.data) {
      userStore.setToken(result.data.tokenAuth.token);
      userStore.setUser(result.data.tokenAuth.user);
      router.push('/');
    } else {
      console.error('No se pudo iniciar sesión o la respuesta no contiene los datos esperados.');
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Ocurrió un error durante el inicio de sesión.';
    console.error(errorMessage.value);
  } finally {
    isLoading.value = false; // Stop loading
  }

};
</script>


<template>
  <div class="flex items-center h-screen justify-center px-6 bg-gray-200">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center">
        <img src="../assets/gpt_lawyer.png" width="210px">
      </div>

      <form class="mt-4" @submit.prevent="userSignIn()">
        <label class="block">
          <span class="text-sm text-gray-700">Usuario</span>
          <input v-model="signInDetails.username" type="test"
            class="block p-2 border border-gray-400 w-full mt-1 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
        </label>

        <label class="block mt-3">
          <span class="text-sm text-gray-700">Contraseña</span>
          <input v-model="signInDetails.password" type="password"
            class="block p-2 border border-gray-400 w-full mt-1 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
        </label>

        <div v-if="errorMessage" class="mt-3 text-red-500 text-sm">
          {{ errorMessage }}
        </div>

        <div class="flex items-center justify-between mt-4">
          <div>
            <label class="inline-flex items-center">
              <input type="checkbox"
                class="text-indigo-600 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
              <span class="mx-2 text-sm text-gray-600">Remember me</span>
            </label>
          </div>

          <div>
            <a class="block text-sm text-indigo-700 fontme hover:underline" href="#">Forgot your password?</a>
          </div>
        </div>

        <div class="mt-6">
          <button type="submit"
            class="w-full px-4 py-2 text-sm text-center text-white bg-indigo-600 rounded-md focus:outline-none hover:bg-indigo-500"
            :disabled="isLoading">
            <span v-if="!isLoading">Iniciar sesión</span>
            <span v-else>Cargando...</span>
          </button>
        </div>
      </form>
      <div class="text-right">
        <small>¿No tienes una cuenta?
          <router-link to="/signup" class="text-teal-500 hover:underline">Registrate</router-link>
        </small>
      </div>
    </div>
  </div>
</template>
