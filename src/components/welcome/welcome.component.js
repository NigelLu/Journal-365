import React, { Component } from "react";

export default class Welcome extends Component {
	constructor(props) {
		super(props);

		this.server = props.server;

		this.state = {
			profileImg: "/img/default_profileImg.png",
			background: "/img/default.jpg",
		};
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
			<div style={{ position: "absolute", top: "13%" }}>
				<h1 style={{ filter: "invert(1)", mixBlendMode: "difference" }}>
					Journal 365,
				</h1>
				<h2 style={{ filter: "invert(1)", mixBlendMode: "difference" }}>
					where the journey begins...
				</h2>
			</div>
		);
	}
}
