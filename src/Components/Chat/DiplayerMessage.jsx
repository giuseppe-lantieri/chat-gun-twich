import React, { useState, useEffect } from 'react'
import Message from './Message';

export default function DiplayerMessage({ list }) {

	return (
		<div>
			{
				list && <div style={{}}>
					{
						list.map((m, index) => (
							<div key={index}>
								<Message img={m.image} nome={m.name} messaggio={m.message} data={m.createdAt} />
							</div>
						))
					}
				</div>
			}
		</div>
	)
}
