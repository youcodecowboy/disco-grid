'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Workflow, 
  Package, 
  Layers, 
  Users, 
  Heart, 
  ShoppingCart, 
  FileText, 
  MessageSquare, 
  CreditCard 
} from 'lucide-react';

interface SidebarProps {
  sidebarExpanded?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function Sidebar({ 
  sidebarExpanded = false, 
  onMouseEnter, 
  onMouseLeave 
}: SidebarProps) {
  const pathname = usePathname();

  const navigationItems = [
    { 
      icon: BarChart3, 
      label: "Dashboard", 
      href: "/",
      active: pathname === "/"
    },
    { 
      icon: Workflow, 
      label: "Workflows", 
      href: "/workflows",
      active: pathname === "/workflows"
    },
    { 
      icon: Package, 
      label: "Items", 
      href: "/items",
      active: pathname === "/items"
    },
    { 
      icon: Layers, 
      label: "Materials", 
      href: "/materials",
      active: pathname === "/materials"
    },
    { 
      icon: Users, 
      label: "Teams", 
      href: "/teams",
      active: pathname === "/teams"
    },
    { 
      icon: Heart, 
      label: "Customers", 
      href: "/customers",
      active: pathname === "/customers"
    },
    { 
      icon: ShoppingCart, 
      label: "Orders", 
      href: "/orders",
      active: pathname === "/orders"
    },
    { 
      icon: FileText, 
      label: "Reports", 
      href: "/reports",
      active: pathname === "/reports"
    },
    { 
      icon: MessageSquare, 
      label: "Messages", 
      href: "/messages",
      active: pathname === "/messages"
    },
    { 
      icon: CreditCard, 
      label: "Billing", 
      href: "/billing",
      active: pathname === "/billing"
    },
  ];

  return (
    <aside
      className={`transition-all duration-200 border-r bg-sidebar ${sidebarExpanded ? "w-60" : "w-16"}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <nav className="p-3 space-y-2 h-full overflow-y-auto">
        {navigationItems.map(({ icon: Icon, label, href, active }) => (
          <Link
            key={label}
            href={href}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors ${
              active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground'
            }`}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {sidebarExpanded && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
