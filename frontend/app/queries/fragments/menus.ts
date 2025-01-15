import { gql } from '@apollo/client';

export const MenuFragment = gql`
  fragment MenuFragment on Menu {
    id
    databaseId
    name
    menuItems {
      edges {
        node {
          id
          label
          parentId
          url
        }
      }
    }
  }
`;