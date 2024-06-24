import gql from "graphql-tag";


export const CREATE_STUDY_CASE = gql`
  mutation ($title: String!, $description: String) {
    createStudyCase(input: { title: $title, description: $description }) {
      studyCase {
        id
        title
        description
        owner {
          id
          username
        }
      }
    }
  }
`;

export const UPDATE_STUDY_CASE = gql`
  mutation ($id: ID!, $title: String, $description: String) {
    updateStudyCase(input: { id: $id, title: $title, description: $description }) {
      studyCase {
        id
        title
        description
      }
    }
  }
`;

export const DELETE_STUDY_CASE = gql`
  mutation ($id: ID!) {
    deleteStudyCase(id: $id) {
      success
    }
  }
`;
export const PROCESS_STUDY_CASE = gql`
  mutation ($id: ID!) {
    processStudyCase(id: $id) {
      success
    }
  }
`;