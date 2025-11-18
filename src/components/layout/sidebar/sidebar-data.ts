import {
  Container,
  LayoutDashboard,
  NotebookText,
  UserCog,
} from "lucide-react";
import type { SidebarData } from "./types";

export const sidebarData: SidebarData = {
  user: {
    name: "satnaing",
    email: "satnaingdev@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    // {
    //   name: 'Shadcn Admin',
    //   logo: Command,
    //   plan: 'Vite + ShadcnUI',
    // },
    // {
    //   name: 'Acme Inc',
    //   logo: GalleryVerticalEnd,
    //   plan: 'Enterprise',
    // },
    // {
    //   name: 'Acme Corp.',
    //   logo: AudioWaveform,
    //   plan: 'Startup',
    // },
  ],
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/exam/admin",
          icon: LayoutDashboard,
        },
        // {
        //   title: "Exams",
        //   url: "/exam/admin/exams",
        //   icon: ListTodo,
        // },
        {
          title: "Requests",
          url: "/exam/admin/examinees",
          icon: NotebookText,
        },
        {
          title: "Vendors",
          url: "/exam/admin/categories",
          icon: Container,
        },
        {
          title: "Users",
          url: "/exam/admin/users",
          icon: UserCog,
        },
      ],
    },
  ],
};
