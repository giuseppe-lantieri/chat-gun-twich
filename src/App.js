import Chat from "./Components/Chat/Chat";
import {
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom";
import Login from "./Components/Login/Login";
import Utils from "./Components/Login/Utils";
import UserContext from "./Context/UserProvider";
import { useState } from "react";

import "./App.css";

export default function App() {
	const client_id = process.env.REACT_APP_CLIENT_ID;
	const [User, setUser] = useState({});

	return (
		<div >
			<UserContext.Provider value={localStorage.getItem("lastContext") ? JSON.parse(localStorage.getItem("lastContext")) : User}>
				<Router>
					<Switch>
						<Route path="/chat">
							<Chat client_id={client_id} />
						</Route>
						<Route path="/redirect">
							<Utils client_id={client_id} setter={setUser}></Utils>
						</Route>
						<Route path="/">
							<Login client_id={client_id} />
						</Route>
					</Switch>
				</Router>
			</UserContext.Provider>
		</div>
	);
}