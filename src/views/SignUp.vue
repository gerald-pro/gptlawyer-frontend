<template>
  <div class="flex items-center h-screen justify-center px-6 bg-gray-200">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center">
        <img src="../assets/gpt_lawyer.png" width="210px">
      </div>

      <form class="mt-4" @submit.prevent="userSignUp">
        <label class="block">
          <span class="text-sm text-gray-700">Username</span>
          <input v-model="signUpDetails.username" type="text"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
        </label>

        <label class="block mt-3">
          <span class="text-sm text-gray-700">Email</span>
          <input v-model="signUpDetails.email" type="email"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
        </label>

        <label class="block mt-3">
          <span class="text-sm text-gray-700">Password</span>
          <input v-model="signUpDetails.password" type="password"
            class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
        </label>

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

const userStore = useUserStore();

const signUpDetails = ref({
  username: '',
  email: '',
  password: ''
});

const { mutate: userSignUpMutation } = useMutation(USER_SIGNUP);
const { mutate: userSignInMutation } = useMutation(USER_SIGNIN);

const userSignUp = async () => {
  // Registrar usuario
  await userSignUpMutation({
    username: signUpDetails.value.username,
    email: signUpDetails.value.email,
    password: signUpDetails.value.password,
  });

  // Iniciar sesión
  const result: FetchResult<any, Record<string, any>, Record<string, any>> | null = await userSignInMutation({
    username: signUpDetails.value.username,
    password: signUpDetails.value.password,
  });


  if (result && result.data) {
    userStore.setToken(result.data.tokenAuth.token);
    userStore.setUser(result.data.tokenAuth.user);
  } else {
    console.error('No se pudo iniciar sesión o la respuesta no contiene los datos esperados.');
  }
};
</script>