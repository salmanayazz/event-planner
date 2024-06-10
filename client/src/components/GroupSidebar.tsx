import Sidebar from "./Sidebar";
import { FiCalendar, FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { GROUP_EVENTS_LINK, GROUP_USERS_LINK } from "../links";

interface GroupSidebarProps {
  groupId: number;
}

export default function GroupSidebar({ groupId }: GroupSidebarProps) {
  const navigate = useNavigate();
  return (
    <Sidebar
      items={[
        {
          icon: FiCalendar,
          label: "Events",
          onClick: () => {
            navigate(GROUP_EVENTS_LINK(groupId), { replace: true });
          },
          selected: window.location.pathname === GROUP_EVENTS_LINK(groupId),
        },
        {
          icon: FiUsers,
          label: "Friends",
          onClick: () => {
            navigate(GROUP_USERS_LINK(groupId), { replace: true });
          },
          selected: window.location.pathname === GROUP_USERS_LINK(groupId),
        },
      ]}
    />
  );
}
