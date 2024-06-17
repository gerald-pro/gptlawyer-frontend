import gql from "graphql-tag";

export const CREATE_COLLABORATOR = gql`
  mutation CreateCollaborator($input: CollaboratorInput!) {
    createCollaborator(input: $input) {
      collaborator {
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
  }
`;

export const UPDATE_COLLABORATOR = gql`
  mutation UpdateCollaborator($input: UpdateCollaboratorInput!) {
    updateCollaborator(input: $input) {
      collaborator {
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
  }
`;

export const DELETE_COLLABORATOR = gql`
  mutation DeleteCollaborator($id: ID!) {
    deleteCollaborator(id: $id) {
      collaborator {
        id
      }
    }
  }
`;