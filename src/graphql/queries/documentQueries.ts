import gql from "graphql-tag";

export const GET_ALL_DOCUMENTS = gql`
  query {
    allDocuments {
      id
      name
      content
      fileType
      urlPath
      uploadedBy {
        id
        username
      }
    }
  }
`;

export const GET_DOCUMENT = gql`
  query GetDocument($id: Int!) {
    document(id: $id) {
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
`;

export const GET_DOCUMENTS_BY_STUDY_CASE = gql`
  query ($id: Int!) {
    documentsByStudyCase(studyCaseId: $id) {
      id
      name
      content
      contentType
      file
      uploadedAt
      uploadedBy {
        id
        username
      }
    }
  }
`;
