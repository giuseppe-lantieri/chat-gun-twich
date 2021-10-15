import { useEffect, useState, useContext } from 'react'
import Gun from 'gun'
import SEA from 'gun/sea';
import UserContext from '../../Context/UserProvider';
import DiplayerMessage from './DiplayerMessage';
import { Link } from 'react-router-dom';

const gun = Gun(['http://localhost:8765/gun', 'https://gun-server-js.herokuapp.com/', 'https://gun-server-europe.herokuapp.com/', 'https://gun-manhattan.herokuapp.com/gun']);

export default function Chat({ client_id }) {
	const [message, setMessage] = useState('')
	const [array, setArray] = useState([])
	const [DecryptedContext, setDecryptedContext] = useState();
	const [Error, setError] = useState("");
	const context = useContext(UserContext);

	useEffect(() => {
		(async () => {
			let decryptContext = await SEA.decrypt(context, client_id);
			if (!decryptContext) { setError("C'è stato un errore"); return; };
			setDecryptedContext(decryptContext);
			gun.get('GanzioBello').get('chat').get('messages').get(decryptContext.idChat).map().on(async m => {
				let decypted = await SEA.decrypt(m, decryptContext.idChat);
				let aux = array;
				aux.push(decypted);
				aux.sort((a, b) => a.createdAt - b.createdAt);
				aux = [... new Set(aux.map(ele => (JSON.stringify(ele))))].map(ele => (JSON.parse(ele)));
				setArray(aux);
			})
		})();
	}, [])

	async function saveMessage() {
		const messages = gun.get('GanzioBello').get('chat').get('messages').get(DecryptedContext.idChat);
		const meggageEncrypt = await SEA.encrypt({
			image: DecryptedContext.img,
			name: DecryptedContext.name,
			message: message,
			createdAt: Date.now()
		}, DecryptedContext.idChat);
		messages.set(meggageEncrypt)
		setMessage("")
	}

	function onChange(e) {
		setMessage(e.target.value)
	}

	return (
		<div style={{ padding: 30 }}>
			{Error == "" && <div>
				<div style={{ display: "flex", flexDirection: "column-reverse", overflow: "scroll", height: "80vh" }}>
					<DiplayerMessage list={array}></DiplayerMessage>
				</div>
				<div style={{ display: "flex" }}>
					<input
						onChange={onChange}
						placeholder="Message"
						name="message"
						value={message}
						style={{ flexGrow: "1" }}
					/>
					<button onClick={saveMessage}>Send Message</button>
				</div>
			</div>
			}
			{Error != "" && <div>
				<div>
					{Error}
				</div>
				<Link to="/">Torna al login</Link>
			</div>}
		</div>
	);
}