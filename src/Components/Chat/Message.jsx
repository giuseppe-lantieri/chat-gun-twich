export default function Message({ img, nome, messaggio, data }) {
	return (
		<div style={{ minHeight: "60px", backgroundColor: "#8FA6C4", margin: "4px", padding: "4px", borderRadius: "20px" }}>
			<div style={{ display: "flex", marginBottom: "0px" }}>
				<div style={{ padding: "5px" }}>
					{img && <img src={img} alt="" style={{ height: "6vh", borderRadius: "50px" }} />}
				</div>
				<div style={{ maxWidth: "100vw", marginTop: "5px" }}>
					<span style={{ marginRight: "4px" }}>{nome}:</span>
					<span>{messaggio}</span>
				</div>
			</div>
			<p style={{ fontSize: "0.6em", marginTop: "4px", padding: "5px" }}>{new Date(data).toISOString().split(".")[0].replace("T", " ")}</p>
		</div>
	)
}