import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import CardTests from "./views/StyleTests/CardTests.tsx";
import GuestAccount from "./views/GuestAccount/index.tsx";
import MainPage from "./views/HostJoin/index.tsx";
import Login from "./views/Login/Login.tsx";
import Profile from "./views/Profile/Profile.tsx";
import TodoModal from "./views/TodoPage/index.tsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
	{
		path: "/",
		element: <MainPage />,
	},
	{
		path: "/GuestAccount",
		element: <GuestAccount />,
	},
	{
		path: "/App",
		element: <App />,
	},
	{
		path: "/CardTests",
		element: <CardTests />,
	},
	{
		path: "/Login",
		element: <Login />,
	},
	{
		path: "/Profile",
		element: <Profile />,
	},
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		
		<RouterProvider router={router} />
    	{/* <TodoModal /> */}

		{/* <App /> */}
		{/* <CardTests /> */}
		{/* <GuestAccount /> */}
		{/* <MainPage /> */}
	</StrictMode>
);
