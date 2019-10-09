import * as React from "react";
import { connect } from "react-redux";
import "./App.css";
import { RootState } from "./redux/reducers";
import { actionCreators } from './redux/actions/counter';

interface ConnectProps {
  counter: number;
}

type Props = {} & ConnectProps;

export class App extends React.PureComponent<Props> {
  constructor(props: any) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.props.dispatch(actionCreators.increment(this.props.counter));
  }
  render() {
    return (
      <>
        <section className="hero is-primary">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">Counter App</h1>
            </div>
          </div>
        </section>
        <section className="container">
          <div className="level">
            <div className="level-item has-text-centered">
              <div>
                <p className="heading">Counter</p>
                <p className="title">{this.props.counter}</p>
              </div>
            </div>
          </div>
          {/* Challenge 5: <div className="notification is-danger" /> */}
          <div className="field is-grouped">
            <p className="control">
              <button className="button" id="increment-btn" onClick={this.handleClick}>
                Click to increment
              </button>
            </p>
            <p className="control">
              <button className="button" id="delay-increment-btn">
                Click to increment slowly
              </button>
            </p>
            <p className="control">
              <button className="button" id="remote-fetch-btn">
                Click to fetch server-side
              </button>
            </p>
          </div>
        </section>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  counter: state.counter.value
});

export default connect(mapStateToProps)(App);
