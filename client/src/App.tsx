import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import AuthProvider from "./contexts/auth/AuthProvider";
import GroupList from "./pages/GroupList";
import Event from "./pages/Event";
import GroupsProvider from "./contexts/groups/GroupsProvider";
import EventsProvider from "./contexts/events/EventsProvider";
import LocationsProvider from "./contexts/locations/LocationsProvider";
import "./App.css";
import GroupEvents from "./pages/GroupEvents";
import GroupUsers from "./components/GroupUsers";
import EventLocations from "./pages/EventLocations";
import EventAvailability from "./pages/EventAvailability";
import { LoadScript } from "@react-google-maps/api";
import GroupSettings from "./pages/GroupSettings";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const libraries: any = ["places"];

function App() {
  return (
    <AuthProvider>
      <GroupsProvider>
        <EventsProvider>
          <LocationsProvider>
            <LoadScript
              googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
              libraries={libraries}
              loadingElement={<></>}
            >
              <Router>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/groups" element={<GroupList />} />
                  <Route
                    path="/groups/:groupId/events"
                    element={<GroupEvents />}
                  />
                  <Route
                    path="/groups/:groupId/users"
                    element={<GroupUsers />}
                  />
                  <Route
                    path="/groups/:groupId/settings"
                    element={<GroupSettings />}
                  />
                  <Route
                    path="/groups/:groupId/events/:eventId"
                    element={<Event />}
                  />
                  <Route
                    path="/groups/:groupId/events/:eventId/locations"
                    element={<EventLocations />}
                  />
                  <Route
                    path="/groups/:groupId/events/:eventId/availability"
                    element={<EventAvailability />}
                  />
                </Routes>
              </Router>
            </LoadScript>
          </LocationsProvider>
        </EventsProvider>
      </GroupsProvider>
    </AuthProvider>
  );
}

export default App;
