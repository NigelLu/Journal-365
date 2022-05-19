import React, { Component } from "react";
const axios = require("axios");

export default class viewJournal extends Component {
	constructor(props) {
		super(props);

		// get params from href and extract journalId
		let params = window.location.href.match(/\/viewJournal\?.+/);
		if (params) {
			params = params[0].slice(13);
		} else {
			params = "";
		}
		const journalId = new URLSearchParams(params).get("journalId");
		this.journalId = journalId || undefined;
		this.server = props.server;

		this.state = {
			title: "",
			content: "",
			selectedFiles: undefined,
			dateCreated: undefined,
			profileImg: "/img/default_profileImg.png",
			background: "/img/default.jpg",
			successFlag: 0,
			errorMsg: undefined,
			authenticated: false,
			username: "Default User",
		};
	}

	componentDidMount() {
		axios(`${this.server}/auth`, {
			method: "GET",
			withCredentials: true,
		}).then((res) => {
			if (!res.data.success) {
				window.location = res.data.message;
			} else {
				this.setState({
					authenticated: true,
					username: res.data.username || "Default User",
				});

				axios(`${this.server}/getJournal/${this.journalId}`, {
					method: "GET",
					withCredentials: true,
				})
					.then((res) => {
						if (!res.data.success) {
							window.location = res.data.errorMsg;
						} else {
							this.setState(
								{
									title: res.data.journal.title,
									content: res.data.journal.content,
									selectedFiles: res.data.journal.files[0],
									dateCreated: res.data.journal.dateCreated,
									profileImg:
										res.data.profileImg ||
										"/img/default_profileImg.png",
									background:
										res.data.background ||
										"/img/default.jpg",
								},
								() => {
									document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${this.server}${this.state.background})`;
									document.body.style.backgroundRepeat =
										"no-repeat";
									document.body.style.backgroundAttachment =
										"fixed";
									document.body.style.backgroundSize =
										"cover";
								}
							);
						}
					})
					.catch((err) => {
						console.log(err);
						window.location = "/home";
					});
			}
		});
	}

	componentWillUnmount() {
		document.body.style.backgroundImage = null;
		document.body.style.backgroundRepeat = null;
		document.body.style.backgroundAttachment = null;
		document.body.style.backgroundSize = null;
	}

	render() {
		let file = undefined;
		if (this.state.selectedFiles) {
			file = this.state.selectedFiles.name || this.state.selectedFiles;
		}

		return (
			<>
				<div className="row">
					<div className="col-3">
						<div
							className="card"
							style={{
								width: "80%",
								borderRadius: "12px",
								overflow: "hidden",
							}}
						>
							<br></br>
							<img
								className="card-img-top"
								src={`${this.server}${this.state.profileImg}`}
								alt="Card image cap"
								style={{
									width: "100px",
									height: "100px",
									margin: "auto",
									position: "relative",
									top: "10px",
									borderRadius: "50%",
								}}
							></img>
							<br></br>
							<div className="card-body">
								<h5 className="card-title">
									{this.state.username}
								</h5>
								<p className="card-text">
									Hinc itur ad astra... 🌟
								</p>
								<a href="/home" className="btn btn-primary">
									Home
								</a>
							</div>
						</div>
						<br></br>
						<br></br>
						<br></br>
						<br></br>
					</div>
					<div className="col-9">
						{this.state.successFlag === 1 && (
							<>
								<p className="text-center" style={{ filter: "invert(1)", mixBlendMode: "difference" }}>
									{" "}
									{this.state.errorMsg}{" "}
								</p>
								<br></br>
								<br></br>
							</>
						)}
						<div
							className="card text-center"
							style={{
								width: "100%",
								borderRadius: "12px",
								overflow: "hidden",
							}}
						>
							<div className="card-header">
								<b>Journal</b>
							</div>
							<div className="card-body">
								<ul className="list-group list-group-flush align-items-center">
									<li className="list-group-item">
										<h3>{this.state.title}</h3>
									</li>

									<li className="list-group-item">
										<p>{this.state.content}</p>
									</li>

									{file !== undefined && (
										<li
											className="list-group-item"
											style={{ width: "40%" }}
										>
											<a
												href={`${this.server}/uploads/${this.state.selectedFiles}`}
												className="btn btn-outline-primary text-center"
												download
											>
												{this.state.selectedFiles}
											</a>
										</li>
									)}
								</ul>

								<a
									href={`/editJournal?journalId=${this.journalId}`}
									className="btn btn-primary"
								>
									Edit
								</a>
							</div>
							<div className="card-footer text-muted">
								Created on{" "}
								{new Date(
									this.state.dateCreated
								).toLocaleDateString(
									"en-US",
									this.DATE_OPTIONS
								)}
							</div>
						</div>
						<br></br>
						<br></br>
						<br></br>
						<br></br>
					</div>
				</div>
			</>
		);
	}
}
