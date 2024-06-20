<template>
  <div class="flex items-center h-screen justify-center px-6 bg-gray-200">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center">
        <img src="../assets/gpt_lawyer.png" width="210px">
      </div>

      <form class="mt-4" @submit.prevent="userSignUp">
        <label class="block">
          <span class="text-sm text-gray-700">Nombre</span>
          <input v-model="signUpDetails.name" type="text"
            class="p-2 border border-gray-400 block w-full mt-1 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
        </label>

        <label class="block">
          <span class="text-sm text-gray-700">Username</span>
          <input v-model="signUpDetails.username" type="text"
            class="p-2 border border-gray-400 block w-full mt-1 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
        </label>

        <label class="block mt-3">
          <span class="text-sm text-gray-700">Email</span>
          <input v-model="signUpDetails.email" type="email"
            class="p-2 border border-gray-400 block w-full mt-1 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
        </label>

        <label class="block mt-3">
          <span class="text-sm text-gray-700">Password</span>
          <input v-model="signUpDetails.password" type="password"
            class="p-2 border border-gray-400 block w-full mt-1 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
        </label>

        <div v-if="errorMessage" class="mt-3 text-red-500 text-sm">
          {{ errorMessage }}
        </div>

        <div class="mt-6">
          <button type="submit"
            class="w-full px-4 py-2 text-sm text-center text-white bg-indigo-600 rounded-md focus:outline-none hover:bg-indigo-500">
            Sign Up
          </button>
        </div>
      </form>

      <div class="text-right mt-4">
        <small>¿Ya tienes una cuenta?
          <router-link to="/" class="text-teal-500 hover:underline">Inicia sesión</router-link>
        </small>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useMutation } from '@vue/apollo-composable';
import { USER_SIGNUP, USER_SIGNIN } from '@/mutations';
import type { FetchResult } from '@apollo/client';
import router from '@/router';

const userStore = useUserStore();

const signUpDetails = ref({
  name: '',
  username: '',
  email: '',
  password: ''
});

const { mutate: userSignUpMutation } = useMutation(USER_SIGNUP);
const { mutate: userSignInMutation } = useMutation(USER_SIGNIN);
const errorMessage = ref<string | null>(null);

const userSignUp = async () => {
  try {
    console.log({ ...signUpDetails.value })
    await userSignUpMutation({ ...signUpDetails.value });

    // Iniciar sesión
    const result: FetchResult<any, Record<string, any>, Record<string, any>> | null = await userSignInMutation({
      username: signUpDetails.value.username,
      password: signUpDetails.value.password,
    });


    if (result && result.data) {
      userStore.setToken(result.data.tokenAuth.token);
      userStore.setUser(result.data.tokenAuth.user);
      router.push('/');
    } else {
      errorMessage.value = 'No se pudo iniciar sesión o la respuesta no contiene los datos esperados.';
    }
  } catch (error: any) {
    errorMessage.value = error;
  }
};
</script>