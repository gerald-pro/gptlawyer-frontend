<template>
  <div class="flex items-center h-screen justify-center px-6 bg-gray-200">
    <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
      <div class="flex items-center justify-center">
        <img src="../assets/gpt_lawyer.png" width="210px">
      </div>

      <form class="mt-4" @submit.prevent="userSignUp">
        <label class="block">
          <span class="text-sm text-gray-700">Nombre</span>
          <input v-model="signUpDetails.name" type="text" required
            class="p-2 border border-gray-400 block w-full mt-1 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
        </label>

        <label class="block">
          <span class="text-sm text-gray-700">Username</span>
          <input v-model="signUpDetails.username" type="text" required
            class="p-2 border border-gray-400 block w-full mt-1 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
        </label>

        <label class="block mt-3">
          <span class="text-sm text-gray-700">Email</span>
          <input v-model="signUpDetails.email" type="email" required
            class="p-2 border border-gray-400 block w-full mt-1 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
        </label>

        <label class="block mt-3">
          <span class="text-sm text-gray-700">Password</span>
          <input v-model="signUpDetails.password" type="password" required
            class="p-2 border border-gray-400 block w-full mt-1 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
        </label>

        <div v-if="errorMessage" class="mt-3 text-red-500 text-sm">
          {{ errorMessage }}
        </div>
        <div v-if="showRecaptcha" class="w-full px-4 py-2 text-sm text-center">
          <vue-recaptcha :sitekey="recaptchaSiteKey" @verify="recaptchaUpdated" hl="es"></vue-recaptcha>
        </div>
        <div class="mt-6">
          <button type="submit"
            class="w-full px-4 py-2 text-sm text-center text-white bg-indigo-600 rounded-md focus:outline-none hover:bg-indigo-500">
            Registrarse
          </button>
        </div>

        <div class="mt-4">
          <label class="inline-flex items-center">
            <input type="checkbox" v-model="acceptTerms" class="form-checkbox h-5 w-5 text-indigo-600">
            <span class="ml-2 text-sm text-gray-700">Acepto los
              <span @click="visibleDialog = true" class="text-indigo-600 cursor-pointer hover:underline">
                términos y condiciones
              </span>
            </span>
          </label>
        </div>
      </form>

      <div class="text-right mt-4">
        <small>¿Ya tienes una cuenta?
          <router-link to="/" class="text-teal-500 hover:underline">Inicia sesión</router-link>
        </small>
      </div>
    </div>
  </div>
  <Dialog :style="{ width: '45rem' }" v-model:visible="visibleDialog" header="Terminos y condiciones">
    <div class="container mx-auto px-4">
      <p class="text-gray-800">Bienvenido(a) al "Asistente Virtual Basado en Chatbot para el Estudio de Documentos
        Jurídicos". Antes de proceder con la creación de su cuenta, por favor, lea atentamente los siguientes términos
        y condiciones. Al hacer clic en "Acepto", usted reconoce que ha leído, entendido y acepta cumplir con estos
        términos y condiciones.</p>

      <h3 class="mt-4 text-xl font-medium">Uso del Servicio:</h3>
      <p class="text-gray-800">Usted acepta utilizar el asistente virtual únicamente para fines legales y éticos
        relacionados con el análisis y estudio de documentos jurídicos en el contexto legal boliviano.</p>

      <p class="text-gray-800">Usted se compromete a no utilizar el asistente virtual para cualquier propósito
        ilegal o no autorizado, incluyendo pero no limitado a, violación de leyes de propiedad intelectual, envío de
        spam,
        acoso, y otras actividades prohibidas.</p>

      <h3 class="mt-4 text-xl font-medium">Registro y Seguridad de la Cuenta:</h3>
      <ul class="list-disc text-gray-800 pl-5">
        <li>Usted es responsable de mantener la confidencialidad de su cuenta y contraseña, y de todas las actividades
          que ocurran bajo su cuenta.</li>
        <li>Usted es responsable de proporcionar información veraz y precisa durante el proceso de registro.
          Cualquier información falsa puede resultar en la suspensión o terminación de su cuenta.</li>
        <li>Usted se compromete a notificar de inmediato cualquier uso no autorizado de su cuenta.</li>
      </ul>

      <h3 class="mt-4 text-xl font-medium">Propiedad Intelectual:</h3>
      <p class="text-gray-800">Todo el contenido, software y tecnología utilizados en el asistente virtual,
        incluyendo pero no limitado a, textos, gráficos, logotipos, íconos, imágenes, clips de audio,
        descargas digitales y compilaciones de datos, son propiedad exclusiva de IA Empresarial o de sus proveedores de
        contenido y están protegidos por leyes de propiedad intelectual nacionales e internacionales.
      </p>

      <h3 class="mt-4 text-xl font-medium">Limitaciones de Responsabilidad:</h3>
      <p class="text-gray-800">El uso del asistente virtual es bajo su propio riesgo. El servicio se proporciona "tal
        cual" y "según disponibilidad".
        No garantizamos que el servicio será ininterrumpido, oportuno, seguro o libre de errores. En ningún caso seremos
        responsables por daños directos, indirectos,
        incidentales, especiales, consecuentes o ejemplares, incluyendo la pérdida de beneficios, datos o interrupción
        del negocio.</p>

      <h3 class="mt-4 text-xl font-medium">Privacidad y Protección de Datos:</h3>
      <p class="text-gray-800">Su privacidad es importante para nosotros. Por favor, revise nuestra Política de
        Privacidad para comprender cómo recopilamos, usamos y protegemos su información personal.</p>

      <h3 class="mt-4 text-xl font-medium">Modificaciones del Servicio:</h3>
      <p class="text-gray-800">Nos reservamos el derecho de modificar, suspender o discontinuar el servicio en
        cualquier momento y sin previo aviso. No seremos responsables ante usted ni ante terceros por cualquier
        modificación, suspensión o discontinuidad del servicio.</p>

      <h3 class="mt-4 text-xl font-medium">Cumplimiento Legal:</h3>
      <p class="text-gray-800">Usted acepta cumplir con todas las leyes y regulaciones aplicables en relación con el uso
        del asistente virtual,
        incluyendo pero no limitado a, leyes de privacidad, propiedad intelectual y seguridad de datos.
      </p>
      <p>Usted se compromete a indemnizarnos y mantenernos indemnes de cualquier reclamo, daño, pérdida o gasto
        (incluidos los honorarios legales)
        que surjan de su incumplimiento de estos términos y condiciones o de su uso del servicio.</p>
    </div>
  </Dialog>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import vueRecaptcha from 'vue3-recaptcha2';
import { useUserStore } from '@/stores/user';
import { useMutation } from '@vue/apollo-composable';
import { USER_SIGNUP, USER_SIGNIN } from '@/mutations';
import type { FetchResult } from '@apollo/client';
import router from '@/router';

const userStore = useUserStore();
const visibleDialog = ref(false);
const acceptTerms = ref(false);

const signUpDetails = ref({
  name: '',
  username: '',
  email: '',
  password: ''
});

const showRecaptcha = ref(true);
const recaptchaSiteKey = '6LfpKAEqAAAAAH-crcxCsoHJKsUaOABOg52f_TzO';
const recaptcha = ref<string | null>(null);

const { mutate: userSignUpMutation } = useMutation(USER_SIGNUP);
const { mutate: userSignInMutation } = useMutation(USER_SIGNIN);
const errorMessage = ref<string | null>(null);

const userSignUp = async () => {
  try {
    if (!recaptcha.value) {
      errorMessage.value = 'Por favor, complete el reCAPTCHA.';
      return;
    }

    if (!acceptTerms.value) {
      errorMessage.value = "Debes aceptar los términos y condiciones para registrarte.";
      return;
    }

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

const toggleRecaptcha = () => {
  showRecaptcha.value = !showRecaptcha.value;
};

const recaptchaUpdated = (response: string) => {
  recaptcha.value = response;
};
</script>