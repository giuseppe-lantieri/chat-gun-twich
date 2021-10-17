import { useEffect, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom';
import Gun from 'gun'
import SEA from 'gun/sea';
import UserContext from '../../Context/UserProvider';
import DiplayerMessage from './DiplayerMessage';

const unset = require('gun/lib/unset.js')
// ['http://localhost:8765/gun', 'https://gun-server-js.herokuapp.com/', 'https://gun-server-europe.herokuapp.com/', 'https://gun-manhattan.herokuapp.com/gun']
const gun = Gun(['https://gun-server-js.herokuapp.com/gun', 'https://gun-server-europe.herokuapp.com/gun']);

const Nonym = process.env.REACT_APP_NONYM;
const Ruby_Rust = process.env.REACT_APP_RUBY;
const GeneralChat = process.env.REACT_APP_GENERAL;
const Ganzio = process.env.REACT_APP_GANZIO;

export default function Chat({ client_id, setUs }) {
	const [message, setMessage] = useState('')
	const [array, setArray] = useState([])
	const [DecryptedContext, setDecryptedContext] = useState();
	const [Error, setError] = useState("");
	const context = useContext(UserContext);
	const history = useHistory();

	useEffect(() => {
		(async () => {
			let decryptContext = await SEA.decrypt(context, client_id);
			if (!decryptContext) { setError("C'è stato un errore"); return; };
			setDecryptedContext(decryptContext);
			gun.get('GanzioBello').get('chat').get('messages').get(decryptContext.idChat).map().on(async (m, i) => {
				if (m != null) {
					let decrypted = await SEA.decrypt(m, client_id + decryptContext.idChat);

					if (decryptContext.id == decryptContext.idChat || decryptContext.id == Ganzio) decrypted["id_message"] = i;

					let aux = array;
					aux.push(decrypted);
					aux.sort((a, b) => a.createdAt - b.createdAt);
					aux = [... new Set(aux.map(ele => (JSON.stringify(ele))))].map(ele => (JSON.parse(ele)));
					setArray(aux);
				}
			})
		})();
	}, [])

	async function saveMessage(e) {
		e.preventDefault();
		const messages = gun.get('GanzioBello').get('chat').get('messages').get(DecryptedContext.idChat);
		const messageEncrypted = await SEA.encrypt({
			image: DecryptedContext.img,
			name: DecryptedContext.name,
			message: message,
			createdAt: Date.now()
		}, client_id + DecryptedContext.idChat);
		messages.set(messageEncrypted)
		setMessage("")
	}

	async function deleteMessage(message) {
		const nodeMessage = gun.get('GanzioBello').get('chat').get('messages').get(DecryptedContext.idChat).get(message.id_message);
		nodeMessage.put(null);
		setArray((prex) => (prex.filter(ele => ele != message)));
	}

	function onChange(e) {
		setMessage(e.target.value)
	}

	async function setContext(idChat) {
		let toEncrypt = { id: DecryptedContext.id, img: DecryptedContext.img, idChat: idChat, name: DecryptedContext.name, chatAllowed: DecryptedContext.chatAllowed, token: DecryptedContext.token };
		console.log(toEncrypt)
		let context = await SEA.encrypt(toEncrypt, client_id);
		setUs(context);
		localStorage.setItem("lastContext", JSON.stringify(context));
		history.go("/chat");
	}

	return (
		<div style={{ padding: 30 }}>
			{Error == "" && <div>
				<div>
					<div style={{ height: "10vh", overflowX: "scroll" }}>
						<button key={-1} style={{ margin: "4px" }} onClick={() => {
							history.push("/");
						}} >Home</button>
						{
							DecryptedContext && DecryptedContext.chatAllowed.map((ele, key) => {
								return (
									<button key={key} style={{ margin: "4px" }} onClick={() => {
										setContext(ele)
									}}>
										{
											ele == GeneralChat && "General Chat"
										}
										{
											ele == Nonym && "Nonym Chat"
										}
										{
											ele == Ruby_Rust && "Ruby Rust Chat"
										}
									</button>
								)
							})
						}
					</div>
				</div>
				<div style={{ display: "flex", flexDirection: "column-reverse", overflow: "scroll", height: "80vh" }}>
					<DiplayerMessage list={array} deleteMessage={deleteMessage}></DiplayerMessage>
				</div>
				<div>
					<form onSubmit={saveMessage} style={{ display: "flex" }}>
						<input
							onChange={onChange}
							placeholder="Message"
							name="message"
							value={message}
							style={{ flexGrow: "1" }}
						/>
						<input type="submit" value="Send Message" />
					</form>
				</div>
			</div>
			}
			{Error != "" && <div>
				<div>
					{Error}
				</div>
				<button style={{ width: "300px", margin: "4px" }} onClick={() => {
					localStorage.removeItem("lastContext");
					history.push("/");
				}}>Logout</button>
			</div>}
		</div>
	);
}