import { useMutation, useQuery } from '@vue/apollo-composable';
import { GET_ALL_STUDY_CASES, GET_STUDY_CASE } from '@/graphql/queries/studyCaseQueries';
import { CREATE_STUDY_CASE, UPDATE_STUDY_CASE, DELETE_STUDY_CASE } from '@/graphql/mutations/studyCaseMutations';

export const studyCaseService = {
  async getAllStudyCases() {
    const response = useQuery({ query: GET_ALL_STUDY_CASES });
    return response.data.allStudyCases;
  },

  async getStudyCase(studyCaseId: number) {
    const response = await apolloClient.query({
      query: GET_STUDY_CASE,
      variables: { studyCaseId }
    });
    return response.data.studyCase;
  },

  async createStudyCase(input: { title: string; description: string; ownerId: number }) {
    const response = await apolloClient.mutate({
      mutation: CREATE_STUDY_CASE,
      variables: { input }
    });
    return response.data.createStudyCase.studyCase;
  },

  async updateStudyCase(input: { id: number; title?: string; description?: string; ownerId?: number }) {
    const response = await apolloClient.mutate({
      mutation: UPDATE_STUDY_CASE,
      variables: { input }
    });
    return response.data.updateStudyCase.studyCase;
  },

  async deleteStudyCase(id: number) {
    const response = await apolloClient.mutate({
      mutation: DELETE_STUDY_CASE,
      variables: { id }
    });
    return response.data.deleteStudyCase.studyCase;
  }
};