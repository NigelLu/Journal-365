import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
const axios = require("axios");

export default class Navbar extends Component {
	constructor(props) {
		super(props);
		this.server = props.server;
		this.onLogout = this.onLogout.bind(this);
		this.hideModal = this.hideModal.bind(this);

		this.state = {
			authenticated: false,
			modalShow: false,
			modalMsg: "",
			modalTitle: "WELCOME",
			username: undefined,
		};
	}

	onLogout(e) {
		e.preventDefault();
		axios(`${this.server}/logout`, {
			method: "GET",
			withCredentials: true,
		}).then((res) => {
			if (res.data.success) {
				window.location = res.data.message;
			} else {
				this.setState({
					modalShow: true,
					modalMsg:
						"Ooops, something went wrong and your logout request failed. Please try again or contact system administrator for assistance!",
					modalTitle: "Logout Failed",
				});
			}
		});
	}

	hideModal() {
		this.setState({
			modalShow: false,
		});
	}

	componentDidMount() {
		axios(`${this.server}/auth`, {
			method: "GET",
			withCredentials: true,
		}).then((res) => {
			if (res.data.success) {
				this.setState(
					{
						authenticated: true,
						username: res.data.username,
					}
				);
			} else {
				this.setState({
					modalShow: true,
					modalMsg:
						"Please login to start your Journal 365 voyage...",
					modalTitle: "Welcome",
				});
			}
		});
	}

	render() {
		return (
			<>
				<Modal
					show={this.state.modalShow}
					onHide={this.hideModal}
					size="lg"
					aria-labelledby="contained-modal-title-vcenter"
					centered
				>
					<Modal.Header closeButton>
						<Modal.Title>
							<b>{this.state.modalTitle}</b>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body className="text-center">
						{this.state.modalMsg}
					</Modal.Body>
					<Modal.Footer>
						<Button variant="primary" onClick={this.hideModal}>
							Close
						</Button>
					</Modal.Footer>
				</Modal>

				<nav className="navbar navbar-expand-sm bg-dark navbar-dark">
					<div className="container-fluid">
						<Link to="/" className="navbar-brand">
							&nbsp;&nbsp;&nbsp;&nbsp;
							<img
								src={`${this.server}/img/journal.png`}
								alt="Journal 365"
								width="30"
								height="24"
							></img>
							&nbsp;&nbsp;&nbsp;&nbsp;<b>Journal 365</b>
						</Link>
						{/* <button
							className="navbar-toggler"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#collapsibleNavbar"
						>
							<span className="navbar-toggler-icon"></span>
						</button> */}

						<div
							className="collpase navbar-collapse"
							id="collapsibleNavbar"
						>
							<ul className="navbar-nav">
								{!this.state.authenticated && (
									<>
										<li className="navbar-item">
											<Link
												to="/login"
												className="nav-link"
											>
												Sign&nbsp;in
											</Link>
										</li>
										<li className="navbar-item">
											<Link
												to="/register"
												className="nav-link"
											>
												Register
											</Link>
										</li>
									</>
								)}
								{this.state.authenticated && (
									<>
										<li className="navbar-item">
											<Link
												to="/home"
												className="nav-link"
											>
												Home
											</Link>
										</li>
										<li className="navbar-item">
											<Link
												to="#"
												className="nav-link"
												onClick={this.onLogout}
											>
												Logout
											</Link>
										</li>
									</>
								)}
							</ul>
						</div>
					</div>
				</nav>
			</>
		);
	}
}
