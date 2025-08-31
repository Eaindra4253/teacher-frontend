import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { ErrorPage } from "@/components/pages/ErrorPage";
import { NotFoundPage } from "@/components/pages/NotFoundPage";
import { LoginPage } from "@/pages/auth/Login";
import ClassesPage from "@/pages/teacher/classes.page";
import TeacherDashboardPage from "@/pages/teacher/dashboard.page";
import SchedulesPage from "@/pages/teacher/schedules.page";
import StudentsPage from "@/pages/teacher/students.page";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <DashboardLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <TeacherDashboardPage />, 
        },
        {
          path: "/teacher",
          element: <TeacherDashboardPage />,
        },
        {
          path: "/teacher/students",
          element: <StudentsPage />,
        },
        {
          path: "/teacher/classes",
          element: <ClassesPage />,
        },
        {
          path: "/teacher/schedules",
          element: <SchedulesPage />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  }
);