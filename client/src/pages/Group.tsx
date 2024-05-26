import { Flex } from "@chakra-ui/react";
import { useEvents } from "../contexts/events/EventsContext";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { GROUP_EVENTS_LINK, GROUP_USERS_LINK } from "../links";
import { FiCalendar, FiUsers } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import GroupEvents from "../components/GroupEvents";
import GroupUsers from "../components/GroupUsers";

export default function Group() {
  const navigate = useNavigate();
  const { getEvents } = useEvents();
  const groupId = Number(useParams<{ groupId: string }>().groupId);

  useEffect(() => {
    getEvents(groupId);
  }, [groupId]);

  return (
    <Flex width="100%">
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

      {window.location.pathname === GROUP_EVENTS_LINK(groupId) ? (
        <GroupEvents />
      ) : (
        <GroupUsers />
      )}
    </Flex>
  );
}
