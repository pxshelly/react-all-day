import * as React from "react";
import { connect } from "react-redux";
import "./App.css";
import { RootState } from "./redux/reducers";
import { actionCreators } from './redux/actions/counter';

interface ConnectProps {
  counter: number;
  dispatch: any;
}

interface AppState {
  isLoading: boolean;
}

type Props = {} & ConnectProps;
type State = {} & AppState;

export class App extends React.PureComponent<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: false
    }
    this.handleClickSync = this.handleClickSync.bind(this);
    this.handleClickAsync = this.handleClickAsync.bind(this);
  }

  handleClickSync() {
    this.props.dispatch(actionCreators.increment(this.props.counter));
  }

  handleClickAsync() {
    this.setState({isLoading: true}, () => {
      this.props.dispatch(actionCreators.delayIncrement(this.props.counter))
        .then(this.setState({isLoading: false}))
    });
  }

  //I believe this method should be working correctly, but I was failing the test and was in the middle of debugging when time ran out.
  showLoadingIfAppropriate() {
    console.log(this.state.isLoading);
    return this.state.isLoading ? <span>Loading...</span> : '';
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
                {this.showLoadingIfAppropriate()}
                <p className="title">{this.props.counter}</p>
              </div>
            </div>
          </div>
          {/* Challenge 5: <div className="notification is-danger" /> */}
          <div className="field is-grouped">
            <p className="control">
              <button className="button" id="increment-btn" onClick={this.handleClickSync}>
                Click to increment
              </button>
            </p>
            <p className="control">
              <button className="button" id="delay-increment-btn" onClick={this.handleClickAsync}>
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
