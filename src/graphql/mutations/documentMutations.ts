import gql from "graphql-tag";

export const CREATE_DOCUMENT = gql`
  mutation CreateDocument($input: DocumentInput!) {
    createDocument(input: $input) {
      document {
        id
        name
        content
        fileType
        urlPath
        studyCase {
          id
          title
        }
        uploadedBy {
          id
          username
        }
      }
    }
  }
`;

export const UPLOAD_DOCUMENT = gql`
  mutation ($file: Upload!, $studyCaseId: ID!) {
    uploadDocument(input: { file: $file, studyCaseId: $studyCaseId }) {
      document {
        id
        name
      }
    }
  }
`;

export const UPDATE_DOCUMENT = gql`
  mutation ($id: ID!, $name: String, $content: String) {
    updateDocument(input: { id: $id, name: $name, content: $content }) {
      document {
        id
        name
        content
        contentType
        uploadedBy {
          id
          username
        }
      }
    }
  }
`;

export const DELETE_DOCUMENT = gql`
  mutation ($id: ID!) {
    deleteDocument(id: $id) {
      success
    }
  }
`;