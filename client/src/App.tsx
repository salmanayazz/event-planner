import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import AuthProvider from "./contexts/auth/AuthProvider";
import GroupList from "./pages/GroupList";
import Group from "./pages/Group";
import Event from "./pages/Event";
import GroupsProvider from "./contexts/groups/GroupsProvider";
import EventsProvider from "./contexts/events/EventsProvider";
import LocationsProvider from "./contexts/locations/LocationsProvider";

function App() {
  return (
    <AuthProvider>
      <GroupsProvider>
        <EventsProvider>
          <LocationsProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/groups" element={<GroupList />} />
                <Route path="/groups/:groupId/*" element={<Group />} />
                <Route
                  path="/groups/:groupId/events/:eventId"
                  element={<Event />}
                />
              </Routes>
            </Router>
          </LocationsProvider>
        </EventsProvider>
      </GroupsProvider>
    </AuthProvider>
  );
}

export default App;
