import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useLayout } from "@/context/layout-provider";
// import { AppTitle } from './app-title'
// import { NavGroup } from "./nav-group";
// import { NavUser } from "./nav-user";
import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";
import { SidebarData } from "./types";
interface AppSidebarProps {
  sidebarData: SidebarData;
}
export function AppSidebar({ sidebarData }: AppSidebarProps) {
  const { collapsible, variant } = useLayout();
  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        {/* <TeamSwitcher /> */}

        {/* Replace <TeamSwitch /> with the following <AppTitle />
         /* if you want to use the normal app title instead of TeamSwitch dropdown */}
        {/* <AppTitle /> */}
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props: { title: any }) => (
          <NavGroup items={[]} key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
