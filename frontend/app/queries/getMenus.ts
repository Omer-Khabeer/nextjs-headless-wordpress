import { gql } from '@apollo/client';
import client from '../apollo/client';
import { MenuFragment } from './fragments/menus';

interface MenuItem {
  id: string;
  label: string;
  parentId: string | null;
}

interface Menu {
  id: string;
  databaseId: number;
  name: string;
  menuItems: {
    edges: {
      node: MenuItem;
    }[];
  };
}

const GET_MENUS = gql`
  query GetMenus {
    menus {
      nodes {
        ...MenuFragment
      }
    }
  }
  ${MenuFragment}
`;

export async function getMenus() {
  try {
    const { data } = await client.query({
      query: GET_MENUS,
    });
    return data.menus.nodes;
  } catch (error) {
    console.error('Error fetching menus:', error);
    throw new Error('Failed to fetch menus');
  }
}

export function getMenuByName(menus: Menu[], name: string) {
  return menus.find(menu => menu.name.toLowerCase() === name.toLowerCase());
}