import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
const App = lazy(() => import("./App"));
const About = lazy(() => import("./About"));
const Home = lazy(() => import("./Home"));
const Dashboard = lazy(() => import("./Dashboard"));
const NoMatch = lazy(() => import("./NoMatch"));

const CreateRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  );
};

export default CreateRoutes;
