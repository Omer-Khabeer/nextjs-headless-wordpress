"use client";
import { useEffect, useState } from "react";
import { getMenus } from "../queries/getMenus";

export default function TestMenu() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMenus() {
      try {
        const menus = await getMenus();
        console.log("All Menus:", menus);
      } catch (error) {
        console.error("Error:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch menus"
        );
      }
    }

    fetchMenus();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <div>Check console for menu data</div>;
}
