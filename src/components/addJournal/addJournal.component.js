import React, { Component } from "react";
import FormValidator from "../../FormValidator";
const axios = require("axios");

export default class addJournal extends Component {
	constructor(props) {
		super(props);

		this.onSubmit = this.onSubmit.bind(this);
		this.onFileChange = this.onFileChange.bind(this);
		this.onTitleChange = this.onTitleChange.bind(this);
		this.onContentChange = this.onContentChange.bind(this);
		this.server = props.server;

		this.validator = new FormValidator([
			{
				field: "title",
				method: "isEmpty",
				validWhen: false,
				message: "Journal title required",
			},
			{
				field: "content",
				method: "isLength",
				args: [{ min: 10 }],
				validWhen: true,
				message:
					"Your journal content length must be longer than 10 characters, please try again.",
			},
			{
				field: "fileSize",
				method: "isInt",
				args: [{ min: -1, max: 1024 * 1024 * 30 }],
				validWhen: true,
				message:
					"The size of the file you selected is too large. Please limit the file size under 30MB.",
			},
		]);

		this.state = {
			title: "",
			content: "",
			selectedFiles: null,
			fileSize: 1,
			submitted: false,
			validation: this.validator.init(),
			successFlag: 0,
			errorMsg: undefined,
			authenticated: false,
			profileImg: "/img/default_profileImg.png",
			background: "/img/default.jpg",
		};
	}

	onTitleChange = (e) => {
		this.setState({
			title: e.target.value,
		});
	};

	onContentChange = (e) => {
		this.setState({
			content: e.target.value,
		});
	};

	onFileChange = (e) => {
		// Update the state
		this.setState({
			selectedFiles: e.target.files[0],
			fileSize: e.target.files[0].size,
		});
	};

	onSubmit = (e) => {
		e.preventDefault();

		const validation = this.validator.validate(this.state);
		this.setState({ validation, submitted: true }, () => {
			if (this.state.validation.isValid) {
				const formdata = new FormData();
				formdata.append("title", this.state.title);
				formdata.append("content", this.state.content);
				formdata.append("selectedFiles", this.state.selectedFiles);
				formdata.append("dateCreated", new Date().toString());

				axios(`${this.server}/addJournal`, {
					method: "POST",
					headers: {
						"Content-Type": "multipart/form-data",
					},
					data: formdata,
					withCredentials: true,
				})
					.then((res) => {
						if (res.data.success) {
							window.location = res.data.message;
						} else {
							this.setState({
								successFlag: 1,
								errorMsg: res.data.message,
							});
						}
					})
					.catch((err) => {
						console.log(`Oops, an error occurred\n${err}`);
						this.setState({
							successFlag: 1,
							errorMsg: err,
						});
					});
			}
		});
	};

	componentDidMount() {
		axios(`${this.server}/auth`, {
			method: "GET",
			withCredentials: true,
		}).then((res) => {
			if (!res.data.success) {
				window.location = res.data.message;
			} else {
				this.setState(
					{
						authenticated: true,
						profileImg:
							res.data.profileImg ||
							"/img/default_profileImg.png",
						background: res.data.background || "/img/default.jpg",
						username: res.data.username,
					},
					() => {
						document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${this.server}${this.state.background})`;
						document.body.style.backgroundRepeat = "no-repeat";
						document.body.style.backgroundAttachment = "fixed";
						document.body.style.backgroundSize = "cover";
					}
				);
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
		const validation = this.submitted // if the form has been submitted at least once
			? this.validator.validate(this.state) // then check validity every time we render
			: this.state.validation; // otherwise just use what's in state
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
						<div
							className="card"
							style={{ borderRadius: "12px", overflow: "hidden" }}
						>
							<div className="card-body">
								<h1
									className="text-center"
									style={{ fontWeight: "bold", filter: "invert(1)", mixBlendMode: "difference" }}
								>
									New Journal
								</h1>
								<br></br>
								<br></br>
								{this.state.successFlag === 1 && (
									<p style={{ filter: "invert(1)", mixBlendMode: "difference" }}> {this.state.errorMsg} </p>
								)}
								<form
									onSubmit={this.onSubmit}
									encType="multipart/form-data"
								>
									{validation.title.isInvalid && (
										<>
											<div
												style={{
													color: "#34568B",
													backgroundColor: "rgba(245, 223, 77, 0.3)",
													borderRadius: "5px",
													overflow: "hidden",
													width: "70%",
													margin: "auto",
												}}
												className="text-center"
											>
												&emsp;
												<b>
													{validation.title.message}
												</b>
											</div>
											<br></br>
										</>
									)}
									<div className="input-group mb-3">
										<div className="input-group-prepend">
											<span className="input-group-text">
												Title
											</span>
										</div>

										<input
											required
											type="text"
											className="form-control"
											placeholder="Title here..."
											value={this.state.title}
											onChange={this.onTitleChange}
										></input>
									</div>

									{validation.content.isInvalid && (
										<>
											<div
												style={{
													color: "#34568B",
													backgroundColor: "rgba(245, 223, 77, 0.3)",
													borderRadius: "5px",
													overflow: "hidden",
													width: "70%",
													margin: "auto",
												}}
												className="text-center"
											>
												&emsp;
												<b>
													{validation.content.message}
												</b>
											</div>
											<br></br>
										</>
									)}
									<div className="input-group">
										<span className="input-group-text">
											Body
										</span>
										<textarea
											required
											type="text"
											className="form-control"
											placeholder="Content here..."
											value={this.state.content}
											onChange={this.onContentChange}
										></textarea>
									</div>

									<br></br>

									<div className="mb-3">
										<label className="form-label">
											Upload Files
										</label>

										<input
											className="form-control"
											type="file"
											id="formFileMultiple"
											onChange={this.onFileChange}
										></input>
									</div>
									{validation.fileSize.isInvalid && (
										<>
											<div
												style={{
													color: "#34568B",
													backgroundColor: "rgba(245, 223, 77, 0.3)",
													borderRadius: "5px",
													overflow: "hidden",
													width: "70%",
													margin: "auto",
												}}
												className="text-center"
											>
												&emsp;
												<b>
													{
														validation.fileSize
															.message
													}
												</b>
											</div>
											<br></br>
										</>
									)}

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
