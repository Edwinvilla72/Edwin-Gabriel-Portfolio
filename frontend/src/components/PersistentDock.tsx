import React, { useState } from "react";
import { motion } from "framer-motion";
import { matchPath, useLocation, useNavigate } from "react-router-dom";

type DockIcon = "home" | "user" | "folder" | "notebook" | "mail";

type DockItem = {
  id: string;
  label: string;
  path: string;
  icon: DockIcon;
  iconColor: string;
  bubbleColor: string;
  match: (pathname: string) => boolean;
};

const DOCK_ICON_SIZE = 60;
const DOCK_ACTIVE_SCALE = 1.22;
const DOCK_ACTIVE_LIFT = 0;
const DOCK_HIGHLIGHT = "#67e8d7";

const dockItems: DockItem[] = [
  {
    id: "home",
    label: "Home",
    path: "/",
    icon: "home",
    iconColor: "#2f76ff",
    bubbleColor: "#e8f0ff",
    match: (pathname) => pathname === "/"
  },
  {
    id: "about",
    label: "About",
    path: "/about",
    icon: "user",
    iconColor: "#fb8c00",
    bubbleColor: "#fff1df",
    match: (pathname) => pathname === "/about"
  },
  {
    id: "projects",
    label: "Projects",
    path: "/projects",
    icon: "folder",
    iconColor: "#00c7b1",
    bubbleColor: "#e2fbff",
    match: (pathname) => pathname === "/projects" || Boolean(matchPath("/projects/:slug", pathname))
  },
  {
    id: "blog",
    label: "Blog",
    path: "/blog",
    icon: "notebook",
    iconColor: "#ff3b47",
    bubbleColor: "#ffe7eb",
    match: (pathname) => pathname.startsWith("/blog")
  },
  {
    id: "contact",
    label: "Contact",
    path: "/contact",
    icon: "mail",
    iconColor: "#f3c500",
    bubbleColor: "#fff5d9",
    match: (pathname) => pathname === "/contact"
  }
];

const DockGlyph = ({ icon }: { icon: DockIcon }) => {
  switch (icon) {
    case "home":
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22v-8h6v8" /></svg>;
    case "user":
      return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 22a8 8 0 0 1 16 0" /></svg>;
    case "folder":
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" /><path d="M12 11v6" /><path d="M9 14h6" /></svg>;
    case "notebook":
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5z" /><path d="M9 2v20" /><path d="m13 14 4-4" /><path d="m14 9 1 1" /><path d="m16 11 1 1" /></svg>;
    case "mail":
      return <svg viewBox="0 0 24 24" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>;
  }
};

const PersistentDock: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const goToChannel = (item: DockItem) => {
    if (location.pathname === item.path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    navigate(item.path);
  };

  return (
    <motion.nav
      className="channelDock channelDockPersistent interactiveLayer"
      aria-label="Portfolio channels"
      onMouseLeave={() => setActiveItemId(null)}
    >
      {dockItems.map((item) => {
        const active = activeItemId === item.id;
        const current = item.match(location.pathname);

        return (
          <motion.button
            key={item.id}
            type="button"
            className={`channelDockCard ${current ? "is-current" : ""}`}
            aria-label={item.label}
            aria-current={current ? "page" : undefined}
            title={item.label}
            onMouseEnter={() => setActiveItemId(item.id)}
            onFocus={() => setActiveItemId(item.id)}
            onBlur={() => setActiveItemId(null)}
            onClick={() => goToChannel(item)}
            animate={{ scale: active ? DOCK_ACTIVE_SCALE : 1, y: active ? DOCK_ACTIVE_LIFT : 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 22, mass: 0.35 }}
            style={{
              "--dock-icon-color": item.iconColor,
              "--dock-bubble-color": item.bubbleColor,
              "--dock-highlight-color": DOCK_HIGHLIGHT,
              width: `${DOCK_ICON_SIZE}px`,
              minWidth: `${DOCK_ICON_SIZE}px`,
              height: `${DOCK_ICON_SIZE}px`,
              zIndex: active ? 2 : 1
            } as React.CSSProperties}
          >
            <span className="channelDockCardInner">
              <span className="channelDockGlyph"><DockGlyph icon={item.icon} /></span>
            </span>
          </motion.button>
        );
      })}
    </motion.nav>
  );
};

export default PersistentDock;
