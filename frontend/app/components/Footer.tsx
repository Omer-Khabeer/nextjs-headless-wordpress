"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getMenus } from "../queries/getMenus";

export default function Footer() {
  const [footerMenu, setFooterMenu] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const menus = await getMenus();
        const footer = menus.find((menu) => menu.name === "Footer menu");
        setFooterMenu(footer);
      } catch (error) {
        console.error("Error fetching footer menu:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!footerMenu) return null;

  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <nav className="flex justify-center space-x-8">
            {footerMenu.menuItems.edges.map(({ node }: any) => (
              <Link
                key={node.id}
                href="#" // You'll need to add proper URLs/paths here
                className="text-gray-300 hover:text-white"
              >
                {node.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
