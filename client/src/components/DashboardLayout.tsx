import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/Sidebar";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  IconArrowLeft,
  IconChartBar,
  IconPlus,
  IconUserCircle,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const links = [
    {
      label: "My Polls",
      href: "/dashboard",
      icon: (
        <IconChartBar className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Create Poll",
      href: "/create-poll",
      icon: (
        <IconPlus className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#", // Href is just a placeholder
      onClick: logout, // <-- Connect to our auth context
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  return (
    // Use h-screen to make it full height
    <div className="flex w-full min-h-screen flex-1 flex-col overflow-hidden bg-neutral-800 md:flex-row">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-y-auto">
            {/* Use our app's logo */}
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                // Use React Router's <Link> for navigation
                <Link
                  to={link.href}
                  key={idx}
                  onClick={link.onClick}
                >
                  <SidebarLink link={link} />
                </Link>
              ))}
            </div>
          </div>
          {/* User Profile Section */}
          <div>
            <SidebarLink
              link={{
                label: user?.username || "Profile",
                href: "#", // Later this could go to a /profile page
                icon: (
                  <IconUserCircle className="h-7 w-7 shrink-0 text-neutral-200" />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      
      {/* This Outlet renders the child route (e.g., Dashboard.tsx) */}
      <div className="flex flex-1">
        <div className="flex h-full w-full flex-1 flex-col rounded-tl-2xl border-l border-t border-neutral-700 bg-slate-950 p-4 md:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

// Custom Logo components to match our app
export const Logo = () => {
  return (
    <div className="relative z-20 flex items-center gap-2 py-1 text-xl font-bold text-white">
      <img 
    src="/logo.png" 
    alt="Opus Polls Logo" 
    className="h-7 w-7 text-cyan-500" // Use your existing class names for styling
  />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-white"
      >
        OPUS
      </motion.span>
    </div>
  );
};

export const LogoIcon = () => {
  return (
<img 
    src="/logo.png" 
    alt="Opus Polls Logo" 
    className="h-7 w-7 text-cyan-500" // Use your existing class names for styling
  />
  );
};