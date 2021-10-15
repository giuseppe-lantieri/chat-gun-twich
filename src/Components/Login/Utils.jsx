import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import SEA from 'gun/sea';


const Nonym = process.env.REACT_APP_NONYM;
const Ruby_Rust = process.env.REACT_APP_RUBY;
const GeneralChat = process.env.REACT_APP_GENERAL;

export default function Utils({ client_id, setter }) {
	const [User, setUser] = useState({ id: "", image: "", name: "" })
	const [Username, setUsername] = useState("");
	const [SubscribedNonym, setSubscribedNonym] = useState(false);
	const [SubscribedRubyRust, setSubscribedRubyRust] = useState(false);
	const [Searched, setSearched] = useState(false);

	const history = useHistory();

	async function searchUsername() {
		const accessToken = document.location.hash.split("#")[1].split("&")[0].split("=")[1];

		const specsFetch = { method: 'get', headers: new Headers({ 'Authorization': 'Bearer ' + accessToken, 'Client-id': client_id }) };

		let user = (await ((await fetch('https://api.twitch.tv/helix/users?login=' + Username, specsFetch)).json())).data;
		if (user && Array.isArray(user) && user.length > 0) {
			user = user[0]
			const id = user.id;
			const image = user.profile_image_url;
			const name = user.display_name
			setUser({ id: id, image: image, name: name });
			let response;
			response = (await ((await fetch('https://api.twitch.tv/helix/subscriptions/user?broadcaster_id=' + Nonym + '&user_id=' + id, specsFetch)).json())).data;
			if (response && Array.isArray(response) && response.length > 0) {
				setSubscribedNonym(true);
			}
			response = (await ((await fetch('https://api.twitch.tv/helix/subscriptions/user?broadcaster_id=' + Ruby_Rust + '&user_id=' + id, specsFetch)).json())).data;
			if (response && Array.isArray(response) && response.length > 0) {
				setSubscribedRubyRust(true);
			}
		}
		setUsername("");
		setSearched(true);
	}

	async function setContext(idChat) {
		let toEncrypt = { id: User.id, img: User.image, idChat: idChat, name: User.name };
		console.log(toEncrypt)
		let context = await SEA.encrypt(toEncrypt, client_id);
		setter(context);
		localStorage.setItem("lastContext", JSON.stringify(context));
		history.push("/chat");
	}

	function onChange(e) {
		setUsername(e.target.value)
	}

	return (
		<div>
			<div style={{ width: "300px", height: "500px", margin: "auto", marginTop: "30px" }}>
				<div style={{ margin: "10px" }}>
					<input
						onChange={onChange}
						placeholder="Insert Your Username"
						name="message"
						value={Username}
						style={{ flexGrow: "1", marginTop: "20px" }}
					/>
					<button onClick={searchUsername}>Verify Sub!</button>
				</div>

				<div style={{ display: "flex" }}>
					<div style={{ margin: "auto", marginTop: "50%", backgroundColor: "#8A8E94", borderRadius: "20px", padding: "30px" }}>
						{(!SubscribedNonym && !SubscribedRubyRust && !Searched) &&
							<div>
								<p>Search Username</p>
							</div>
						}
						{
							Searched &&
							<div>
								<button style={{ backgroundColor: "#8FA6C4", padding: "5px", margin: "4px", borderRadius: "20px" }} onClick={() => { setContext(GeneralChat) }}>General Chat!</button>
							</div>
						}
						{
							SubscribedNonym &&
							<div>
								<button style={{ backgroundColor: "#8FA6C4", padding: "5px", margin: "4px", borderRadius: "20px" }} onClick={() => { setContext(Nonym) }}>Nonym Chat!</button>
							</div>
						}
						{
							SubscribedRubyRust &&
							<div>
								<button style={{ backgroundColor: "#8FA6C4", padding: "5px", margin: "4px", borderRadius: "20px" }} onClick={() => { setContext(Ruby_Rust) }}>Ruby Rust Chat!</button>
							</div>
						}
					</div>
				</div>
			</div>
		</div>
	)
}
