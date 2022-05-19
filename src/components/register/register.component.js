import React, { Component } from "react";
const axios = require("axios");

export default class Register extends Component {
	constructor(props) {
		super(props);

		this.onChangeUsername = this.onChangeUsername.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.server = props.server;

		this.state = {
			username: "",
			password: "",
			successFlag: 0,
			errorMsg: undefined,
			profileImg: "/img/default_profileImg.png",
			background: "/img/default.jpg",
		};
	}

	onChangeUsername(e) {
		this.setState({
			username: e.target.value,
		});
	}

	onChangePassword(e) {
		this.setState({
			password: e.target.value,
		});
	}

	onSubmit(e) {
		e.preventDefault();

		const user = {
			username: this.state.username,
			password: this.state.password,
		};

		axios(`${this.server}/register`, {
			method: "POST",
			data: user,
			withCredentials: true,
		}).then((res) => {
			if (res.data.success) {
				window.location = res.data.message;
			} else {
				this.setState({
					successFlag: 1,
					errorMsg: res.data.message,
				});
			}
		});
	}

	componentDidMount() {
		document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${this.server}${this.state.background})`;
		document.body.style.backgroundRepeat = "no-repeat";
		document.body.style.backgroundAttachment = "fixed";
		document.body.style.backgroundSize = "cover";
	}

	componentWillUnmount() {
		document.body.style.backgroundImage = null;
		document.body.style.backgroundRepeat = null;
		document.body.style.backgroundAttachment = null;
		document.body.style.backgroundSize = null;
	}

	render() {
		return (
			<div className="container" style={{ width: "60%"}}>
				<h1
					className="text-center"
					style={{ fontWeight: "bold", filter: "invert(1)", mixBlendMode: "difference" }}
				>
					Register
				</h1>
				<br></br>
				<br></br>
				{this.state.successFlag === 1 && (
					<>
						<p
							className="text-center"
							style={{
								fontWeight: "bold",
								filter: "invert(1)",
								mixBlendMode: "difference",
							}}
						>
							{" "}
							{this.state.errorMsg.slice(0, 15) ===
							"UserExistsError"
								? "Sorry, the username already exists. Please try another one!"
								: this.state.errorMsg}{" "}
						</p>
						<br></br>
					</>
				)}
				<form onSubmit={this.onSubmit}>
					<div className="input-group mb-3">
						<div className="input-group-prepend">
							<span className="input-group-text">Username</span>
						</div>
						<input
							required
							type="text"
							className="form-control"
							placeholder="username..."
							value={this.state.username}
							onChange={this.onChangeUsername}
						></input>
					</div>
					<div className="input-group mb-3">
						<div className="input-group-prepend">
							<span className="input-group-text">Password</span>
						</div>
						<input
							required
							type="password"
							className="form-control"
							value={this.state.password}
							onChange={this.onChangePassword}
						></input>
					</div>
					<br></br>
					<div className="col-md-12 text-center">
						<button
							type="submit"
							className="btn btn-primary text-center"
							style={{ textAlign: "center" }}
						>
							SUBMIT
						</button>
					</div>
				</form>
			</div>
		);
	}
}
