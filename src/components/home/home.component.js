import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
const axios = require("axios");

export default class Home extends Component {
	constructor(props) {
		super(props);

		this.DATE_OPTIONS = {
			weekday: "short",
			year: "numeric",
			month: "short",
			day: "numeric",
		};

		this.server = props.server;
		this.onEdit = this.onEdit.bind(this);
		this.hideModal = this.hideModal.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onConfirmDelete = this.onConfirmDelete.bind(this);

		this.state = {
			authenticated: false,
			journals: [],
			errorMsg: "",
			profileImg: "/img/default_profileImg.png",
			background: "/img/default.jpg",
			username: "Default User",
			modalShow: false,
			modalMsg: "",
			modalTitle: "WELCOME",
			journalToDelete: null,
		};
	}

	hideModal() {
		this.setState({
			modalShow: false,
		});
	}

	onEdit(e) {
		window.location = `/editJournal?journalId=${e.target.value}`;
	}

	onView(e) {
		window.location = `/viewJournal?journalId=${e.target.value}`;
	}

	onDelete(e) {
		this.setState({
			modalShow: true,
			modalMsg: `Are you sure you want to delete the journal named "${e.target.title}"?`,
			modalTitle: "Delete Confirm",
			journalToDelete: e.target.value,
		});
	}

	onConfirmDelete() {
		axios(`${this.server}/deleteJournal`, {
			method: "POST",
			data: {
				journalId: this.state.journalToDelete,
			},
			withCredentials: true,
		})
			.then((res) => {
				if (res.data.success) {
					this.setState(
						{
							journalToDelete: null,
							modalShow: false,
							modalMsg: "",
							modalTitle: "WELCOME",
						},
						() => {
							window.location = res.data.message;
						}
					);
				} else {
					this.setState(
						{
							journalToDelete: null,
							modalShow: false,
							modalMsg: "",
							modalTitle: "WELCOME",
						},
						() => {
							if (res.data.errorMsg) {
								window.location = res.data.errorMsg;
							} else {
								window.location = "/home";
							}
						}
					);
				}
			})
			.catch((err) => {
				console.log(`Oops, an error occurred\n${err}`);
				this.setState(
					{
						journalToDelete: null,
						modalShow: false,
						modalMsg: "",
						modalTitle: "WELCOME",
					},
					() => {
						window.location = "/home";
					}
				);
			});
	}

	componentDidMount() {
		axios(`${this.server}/auth`, {
			method: "GET",
			withCredentials: true,
		})
			.then((res) => {
				if (!res.data.success) {
					window.location = res.data.message;
				} else {
					this.setState({
						authenticated: true,
						username: res.data.username,
					});

					axios(`${this.server}/home`, {
						method: "GET",
						withCredentials: true,
					})
						.then((res) => {
							this.setState(
								{
									journals: res.data.journals,
									profileImg:
										res.data.profileImg ||
										"/img/default_profileImg.png",
									background:
										res.data.background ||
										"/img/default.jpg",
								},
								() => {
									document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),url(${this.server}${this.state.background})`;
									document.body.style.backgroundRepeat =
										"no-repeat";
									document.body.style.backgroundAttachment =
										"fixed";
									document.body.style.backgroundSize =
										"cover";
								}
							);
						})
						.catch((err) => {
							console.log(`Oops, an error occurred\n${err}`);
							this.setState(
								{
									errorMsg: err,
									profileImg: "/img/default_profileImg.png",
									background: "/img/default.jpg",
								},
								() => {
									document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${this.server}${this.state.background})`;
									document.body.style.backgroundRepeat =
										"no-repeat";
									document.body.style.backgroundAttachment =
										"fixed";
									document.body.style.backgroundSize =
										"cover";
								}
							);
						});
				}
			})
			.catch((err) => {
				console.log(`Oops, an error occurred\n${err}`);
				window.location = "/login";
			});
	}

	componentWillUnmount() {
		document.body.style.backgroundImage = null;
		document.body.style.backgroundRepeat = null;
		document.body.style.backgroundAttachment = null;
		document.body.style.backgroundSize = null;
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
							Cancel
						</Button>
						<Button
							variant="secondary"
							onClick={this.onConfirmDelete}
						>
							Delete
						</Button>
					</Modal.Footer>
				</Modal>
				<div className="row">
					<div className="col-3">
						<div
							className="card text-white bg-dark border-0"
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
								<a
									href="/addProfileImg"
									className="btn btn-primary stretched-link"
								>
									Customize
								</a>
							</div>
						</div>

						<br></br>
						<br></br>
						<br></br>
						<br></br>

						<div
							className="card text-white bg-dark border-0"
							style={{
								width: "80%",
								borderRadius: "12px",
								overflow: "hidden",
							}}
						>
							<img
								src={`${this.server}/img/notebook.jpg`}
								className="card-img-top"
								alt="Add Journal"
							></img>
							<div className="card-body">
								<h5 className="card-title">New Journal</h5>
								<p className="card-text">
									Those golden old days...
								</p>
								<a
									href="/addJournal"
									className="btn btn-primary stretched-link"
								>
									Create
								</a>
							</div>
						</div>
						<br></br>
						<br></br>
						<br></br>
						<br></br>
						<div
							className="card text-white bg-dark border-0"
							style={{
								width: "80%",
								borderRadius: "12px",
								overflow: "hidden",
							}}
						>
							<img
								src={`${this.server}/img/blog.jpg`}
								className="card-img-top"
								alt="Add Journal"
							></img>
							<div className="card-body">
								<h5 className="card-title">
									Change Background
								</h5>
								<p className="card-text">
									Show us the style of your own...
								</p>
								<a
									href="/addBackground"
									className="btn btn-primary stretched-link"
								>
									Customize
								</a>
							</div>
						</div>
						<br></br>
						<br></br>
						<br></br>
						<br></br>
					</div>
					<div className="col-9">
						{this.state.errorMsg !== "" && (
							<p style={{ filter: "invert(1)", mixBlendMode: "difference" }}> {this.state.errorMsg} </p>
						)}
						<table
							className="table table-dark table-striped table-hover"
							style={{ borderRadius: "12px", overflow: "hidden" }}
						>
							<thead>
								<tr>
									<th scope="col" className="text-center">
										#
									</th>
									<th scope="col">Title</th>
									<th scope="col">Content</th>
									<th scope="col">Files</th>
									<th scope="col">Date</th>
									<th
										scope="col"
										className="col-2 text-center"
									>
										Action
									</th>
								</tr>
							</thead>
							<tbody>
								{this.state.journals.map((journal, index) => {
									return (
										<tr key={`${index}`}>
											<th scope="row">{index + 1}</th>
											<td>{journal.title}</td>
											<td>
												{journal.content.slice(0, 25) +
													"..."}
											</td>
											<td>
												{journal.files.length !== 0
													? journal.files[0]
													: "------"}
											</td>
											<td className="col-2">
												{new Date(
													journal.dateCreated
												).toLocaleDateString(
													"en-US",
													this.DATE_OPTIONS
												)}
											</td>
											<td className="col-3">
												<button
													type="button"
													className="btn btn-light"
													value={journal._id}
													onClick={this.onEdit}
												>
													EDIT
												</button>
												&nbsp;&nbsp;
												<button
													type="button"
													className="btn btn-primary"
													value={journal._id}
													onClick={this.onView}
												>
													View
												</button>
												&nbsp;&nbsp;
												<button
													type="button"
													className="btn btn-dark"
													value={journal._id}
													onClick={this.onDelete}
													title={journal.title}
												>
													Delete
												</button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
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
