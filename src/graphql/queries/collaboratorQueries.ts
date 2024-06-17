import gql from "graphql-tag";

export const GET_ALL_COLLABORATORS = gql`
  query GetAllCollaborators {
    allCollaborators {
      id
      user {
        id
        username
      }
      studyCase {
        id
        title
      }
    }
  }
`;

export const GET_COLLABORATOR = gql`
  query GetCollaborator($collaboratorId: Int!) {
    collaborator(collaboratorId: $collaboratorId) {
      id
      user {
        id
        username
      }
      studyCase {
        id
        title
      }
    }
  }
`;