import React, { useContext } from 'react'
import UserContext from '../../Context/UserProvider';
import { useHistory } from 'react-router-dom';



const Nonym = process.env.REACT_APP_NONYM;
const Ruby_Rust = process.env.REACT_APP_RUBY;
const GeneralChat = process.env.REACT_APP_GENERAL;


export default function Login({ client_id, setUs }) {
	const context = useContext(UserContext);
	console.log(context instanceof Object);
	const history = useHistory();


	async function refreshSub() {
		let decryptContext = await SEA.decrypt(context, client_id);
		const allowedChat = [GeneralChat];
		let response;
		const specsFetch = { method: 'get', headers: new Headers({ 'Authorization': 'Bearer ' + decryptContext.token, 'Client-id': client_id }) };

		response = (await ((await fetch('https://api.twitch.tv/helix/subscriptions/user?broadcaster_id=' + Nonym + '&user_id=' + decryptContext.id, specsFetch)).json())).data;
		if (response && Array.isArray(response) && response.length > 0) {
			allowedChat.push(Nonym);
		}
		response = (await ((await fetch('https://api.twitch.tv/helix/subscriptions/user?broadcaster_id=' + Ruby_Rust + '&user_id=' + decryptContext.id, specsFetch)).json())).data;
		if (response && Array.isArray(response) && response.length > 0) {
			allowedChat.push(Ruby_Rust);
		}
		let toEncrypt = { id: decryptContext.id, img: decryptContext.img, idChat: decryptContext.idChat, name: decryptContext.name, chatAllowed: allowedChat, token: decryptContext.token };
		console.log(toEncrypt)
		let newContext = await SEA.encrypt(toEncrypt, client_id);
		setUs(newContext);
		localStorage.setItem("lastContext", JSON.stringify(newContext));
		history.push("/chat");
	}

	return (
		<div>
			{
				context instanceof Object &&
				<div style={{ width: "300px", height: "500px", margin: "auto", marginTop: "30px" }}>
					<div style={{ display: "flex" }}>
						<div style={{ margin: "auto", marginTop: "50%", backgroundColor: "#8FA6C4", borderRadius: "20px", padding: "30px" }}>
							<a href={"https://id.twitch.tv/oauth2/authorize?client_id=" +
								client_id +
								"&redirect_uri=" + process.env.REACT_APP_LINK + "redirect/&response_type=token&scope=user:read:subscriptions user:read:email&force_verify=true"}
							>
								Login With Twitch
							</a>
						</div>
					</div>
				</div>
			}
			{
				!(context instanceof Object) &&
				<div style={{ width: "300px", height: "500px", margin: "auto", marginTop: "30px" }}>
					<div style={{ display: "flex" }}>
						<div style={{ margin: "auto", marginTop: "50%", backgroundColor: "#8FA6C4", borderRadius: "20px", padding: "30px" }}>
							<div>
								<button style={{ width: "300px", margin: "4px" }} onClick={() => {
									refreshSub()
								}}>Logged Continue to Chat</button>
							</div>
							<div>
								<button style={{ width: "300px", margin: "4px" }} onClick={() => {
									localStorage.removeItem("lastContext");
									history.go("/");
								}}>Logout</button>
							</div>
						</div>
					</div>
				</div>


			}
		</div>
	)
}
