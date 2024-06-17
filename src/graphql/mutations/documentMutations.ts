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

export const UPDATE_DOCUMENT = gql`
  mutation UpdateDocument($input: UpdateDocumentInput!) {
    updateDocument(input: $input) {
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

export const DELETE_DOCUMENT = gql`
  mutation DeleteDocument($id: ID!) {
    deleteDocument(id: $id) {
      success
    }
  }
`;