"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getMenus } from "../queries/getMenus";
import { useMediaQuery } from "react-responsive";
import { Menu, X, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

interface MenuItem {
  id: string;
  label: string;
  parentId: string | null;
  url: string;
  children?: MenuItem[];
}

function organizeMenuItems(items: MenuItem[]) {
  const itemMap = new Map();
  const rootItems: MenuItem[] = [];

  items.forEach((item) => {
    itemMap.set(item.id, { ...item, children: [] });
  });

  items.forEach((item) => {
    const menuItem = itemMap.get(item.id);
    if (item.parentId) {
      const parent = itemMap.get(item.parentId);
      if (parent) {
        parent.children.push(menuItem);
      }
    } else {
      rootItems.push(menuItem);
    }
  });

  return rootItems;
}

// Function to format WordPress URL to Next.js route
function formatUrl(url: string): string {
  if (!url) return "/";

  // Remove domain if present (for WordPress absolute URLs)
  const urlWithoutDomain = url.replace(/^https?:\/\/[^\/]+/, "");

  // Convert WordPress slugs to Next.js format
  let formattedUrl = urlWithoutDomain;

  // Handle home page
  if (formattedUrl === "/home" || formattedUrl === "") {
    return "/";
  }

  // Ensure URL starts with /
  if (!formattedUrl.startsWith("/")) {
    formattedUrl = "/" + formattedUrl;
  }

  // Remove trailing slash except for home page
  if (formattedUrl !== "/" && formattedUrl.endsWith("/")) {
    formattedUrl = formattedUrl.slice(0, -1);
  }

  return formattedUrl;
}

export default function Navigation() {
  const [mainMenu, setMainMenu] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const pathname = usePathname();

  useEffect(() => {
    async function fetchMenu() {
      try {
        const menus = await getMenus();
        const main = menus.find((menu) => menu.name === "Main menu");
        if (main) {
          const menuItems = main.menuItems.edges.map(({ node }: any) => ({
            id: node.id,
            label: node.label,
            parentId: node.parentId,
            url: formatUrl(node.url), // Format WordPress URLs
          }));
          const organizedMenu = {
            ...main,
            menuItems: organizeMenuItems(menuItems),
          };
          setMainMenu(organizedMenu);
        }
      } catch (error) {
        console.error("Error fetching main menu:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scaleY: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scaleY: 1,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scaleY: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-16">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!mainMenu) return null;

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className="bg-white dark:bg-slate-900 shadow-lg backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <motion.div variants={itemVariants} className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-blue-600 dark:text-blue-400"
            >
              CulinaryAcademy
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          {isMobile && (
            <motion.button
              variants={itemVariants}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          )}

          {/* Desktop Navigation */}
          {!isMobile && (
            <motion.div variants={itemVariants} className="flex space-x-8">
              {mainMenu.menuItems.map((item: MenuItem) => (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.id)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="flex items-center"
                  >
                    <Link
                      href={item.url}
                      className={`inline-flex items-center px-1 pt-1 transition-colors
                        ${
                          pathname === item.url
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                        }`}
                    >
                      {item.label}
                      {item.children?.length > 0 && (
                        <motion.div
                          animate={{
                            rotate: openDropdown === item.id ? 180 : 0,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="ml-1 w-4 h-4" />
                        </motion.div>
                      )}
                    </Link>
                  </motion.div>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {item.children?.length > 0 && openDropdown === item.id && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute left-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 overflow-hidden"
                      >
                        <div className="py-1">
                          {item.children.map((child: MenuItem) => (
                            <motion.div
                              key={child.id}
                              whileHover={{ x: 4 }}
                              className="block"
                            >
                              <Link
                                href={child.url}
                                className={`block px-4 py-2 text-sm transition-colors
                                  ${
                                    pathname === child.url
                                      ? "text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-slate-700"
                                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                                  }`}
                              >
                                {child.label}
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobile && isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-slate-900">
              {mainMenu.menuItems.map((item: MenuItem) => (
                <div key={item.id}>
                  <motion.div whileTap={{ scale: 0.98 }} className="block">
                    <Link
                      href={item.url}
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors
                        ${
                          pathname === item.url
                            ? "text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-slate-800"
                            : "text-gray-700 dark:text-gray-200 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-slate-800"
                        }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                  {item.children?.map((child: MenuItem) => (
                    <motion.div
                      key={child.id}
                      whileTap={{ scale: 0.98 }}
                      className="block"
                    >
                      <Link
                        href={child.url}
                        className={`block pl-6 px-3 py-2 rounded-md text-sm font-medium transition-colors
                          ${
                            pathname === child.url
                              ? "text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-slate-800"
                              : "text-gray-500 dark:text-gray-400 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-slate-800"
                          }`}
                      >
                        {child.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
