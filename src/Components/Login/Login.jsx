import React from 'react'
export default function Login({ client_id }) {

	return (
		<div>
			<div style={{ width: "300px", height: "500px", margin: "auto", marginTop: "30px" }}>
				<div style={{ display: "flex" }}>
					<div style={{ margin: "auto", marginTop: "50%", backgroundColor: "#8FA6C4", borderRadius: "20px", padding: "30px" }}>
						<a href={"https://id.twitch.tv/oauth2/authorize?client_id=" +
							client_id +
							"&redirect_uri=" + process.env.REACT_APP_LINK + "redirect/&response_type=token&scope=user:read:subscriptions user:read:email"}
						>
							Login With Twitch
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}
