import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import AuthProvider from "./contexts/auth/AuthProvider";
import GroupList from "./pages/GroupList";
import Group from "./pages/Group";
import Event from "./pages/Event";
import { GroupsProvider } from "./contexts/groups/GroupsProvider";

function App() {
  return (
    <AuthProvider>
      <GroupsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/groups" element={<GroupList />} />
            <Route path="/groups/:groupId" element={<Group />} />
            <Route
              path="/groups/:groupId/events/:eventId"
              element={<Event />}
            />
          </Routes>
        </Router>
      </GroupsProvider>
    </AuthProvider>
  );
}

export const HOME = () => {
  return "/";
};
export const AUTH = () => {
  return "/auth";
};
export const GROUPS = () => {
  return "/groups";
};
export const GROUP = (groupId: number) => {
  return `/groups/${groupId}`;
};
export const EVENT = (groupId: number, eventId: number) => {
  return `/groups/${groupId}/events/${eventId}`;
};

export default App;
