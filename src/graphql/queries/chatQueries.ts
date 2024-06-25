import gql from "graphql-tag";


export const GET_ALL_MESSAGES = gql`
    query AllMessages ($id: Int!) {
        allMessages(studyId: $id) {
            id
            studyId
            content
            type
            createdAt
        }
    }
`;