// src/apollo-config.ts
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { useUserStore } from './stores/user';


const backendUrl = import.meta.env.VITE_APP_BACKEND_URL || "http://127.0.0.1:8000/graphql";

const httpLink = createUploadLink({ uri: backendUrl });

const authLink = setContext((_, { headers }) => {
  const userStore = useUserStore();
  const token = userStore.getToken;
  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : "",
    }
  };
});

const cache = new InMemoryCache();

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: cache,
});