import ErrorPage from "../utils/ErrorPage";
import MainLayout from "./Layout";
import type { AppRoute } from "../types/AppType";
import Home from "../pages/Home";
import Settings from "../pages/Settings";
import Tasks from "../pages/Tasks";
import Notes from "../pages/Notes";

export const ROUTES = {
  ERROR: "*",
  SETTINGS: "/settings",
  TASKS: "/tasks",
  NOTES: "/notes",
} as const;

const routes: AppRoute[] = [
  { path: ROUTES.ERROR, Component: ErrorPage },
  {
    Component: MainLayout,
    path: "/",
    meta: { layout: true },
    children: [
      { index: true, Component: Home },
      { path: ROUTES.SETTINGS, Component: Settings },
      { path: ROUTES.TASKS, Component: Tasks },
      { path: ROUTES.NOTES, Component: Notes },
    ]
  }
];


export default routes;
