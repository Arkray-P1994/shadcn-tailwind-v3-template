import { LayoutDashboard, NotebookText } from "lucide-react";
import type { SidebarData } from "./types";

export const vendorSidebarData: SidebarData = {
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
      title: "Pages",
      items: [
        {
          title: "Dashboard",
          url: "/vendor",
          icon: LayoutDashboard,
        },
        // {
        //   title: "Exams",
        //   url: "/exam/admin/exams",
        //   icon: ListTodo,
        // },
        // {
        //   title: "Vendors",
        //   url: "/requestor/vendors",
        //   icon: Container,
        // },
        {
          title: "Requests",
          url: "/vendor/requests",
          icon: NotebookText,
        },

        // {
        //   title: "Users",
        //   url: "/exam/admin/users",
        //   icon: UserCog,
        // },
      ],
    },
  ],
};
