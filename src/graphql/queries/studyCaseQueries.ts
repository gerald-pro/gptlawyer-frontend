import gql from "graphql-tag";
export const GET_ALL_STUDY_CASES = gql`
  query ($globalSearch: String!) {
    allStudyCases(globalSearch: $globalSearch)  {
      id
      title
      description
      createdAt
      owner {
        id
        username
      }
      numberOfCollaborators
    }
  }
`;

export const GET_STUDY_CASE = gql`
  query ($studyCaseId: Int!) {
    studyCase(studyCaseId: $studyCaseId) {
      id
      title
      description
      createdAt
      numberOfCollaborators
      documentSet {
        id
        name
        content
        fileType
        urlPath
        uploadedAt
        uploadedBy {
          id
          username
        }
      }
    }
  }
`;
