import React from 'react'
import Message from './Message';

export default function DiplayerMessage({ list, deleteMessage }) {

	return (
		<div>
			{
				list && <div style={{}}>
					{
						list.map((m, index) => (
							<div key={index}>
								<Message message={m} deleteMessage={deleteMessage} />
							</div>
						))
					}
				</div>
			}
		</div>
	)
}
