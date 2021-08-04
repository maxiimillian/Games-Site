import { React, useState, Component } from "react";

export default class Square extends Component {
    constructor(props) {
        super(props);
        this.state = {value: props.value}
    }

    handleChange(e) {
        this.state = {value: e.target.value};
        this.props.handleChange(e);
    }

    render() {
        return (
            <div>
                <input value={this.state.value} onChange={event => this.handleChange}></input>
            </div>
        )
    }
}