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
  query ($id: Int!) {
    studyCase (id: $id) {
      id
      title
      description
      createdAt
      numberOfCollaborators
      documentSet {
        id
        name
        content
        uploadedAt
        uploadedBy {
          id
          username
        }
      }
    }
  }
`;
