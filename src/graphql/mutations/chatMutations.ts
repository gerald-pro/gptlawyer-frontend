import gql from "graphql-tag";


export const SEND_MESSAGE = gql`
    mutation ($content: String!, $id: ID!) {
        messageStudyCase(content: $content, id: $id) {
            success
            res
        }
    }
`;