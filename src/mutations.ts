import gql from "graphql-tag";

export const USER_SIGNUP = gql`
  mutation ($name: String!, $username: String!, $email: String!, $password: String!) {
    signUp (name: $name, username: $username, email: $email, password: $password) {
      user {
        id
        username
      }
    }
  }
`;

export const USER_SIGNIN = gql`
  mutation ($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
      user {
        id
        name
        username
        email
      }
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation (
    $userID: ID!
    $firstName: String!
    $lastName: String!
    $avatar: Upload!
    $bio: String!
    $location: String!
    $website: String!
  ) {
    updateUserProfile(
      userId: $userID
      firstName: $firstName
      lastName: $lastName
      avatar: $avatar
      bio: $bio
      location: $location
      website: $website
    ) {
      user {
        id
        username
        firstName
        lastName
        email
        avatar
        bio
        location
        website
        commentSet {
          id
          content
          post {
            id
            title
            slug
          }
          isApproved
        }
      }
    }
  }
`;