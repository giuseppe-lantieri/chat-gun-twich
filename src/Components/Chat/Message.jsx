import React, { useState, useEffect, useContext } from 'react';
import SEA from 'gun/sea';

export default function Message({ message, deleteMessage }) {

	return (
		<div>
			{message &&
				<div style={{ minHeight: "60px", backgroundColor: "#8FA6C4", margin: "4px", padding: "4px", borderRadius: "20px" }}>
					<div style={{ display: "flex", marginBottom: "0px" }}>
						<div style={{ padding: "5px" }}>
							{message.image && <img src={message.image} alt="" style={{ height: "6vh", borderRadius: "50px" }} />}
						</div>
						<div style={{ maxWidth: "100vw", marginTop: "5px" }}>
							<span style={{ marginRight: "4px" }}>{message.name}:</span>
							<span>{message.message}</span>
						</div>
					</div>
					<p style={{ fontSize: "0.6em", marginTop: "4px", padding: "5px" }}>{new Date(message.createdAt).toISOString()}</p>
					{message.id_message && <button onClick={() => { deleteMessage(message) }}>X</button>}
				</div>
			}
		</div>
	)
}