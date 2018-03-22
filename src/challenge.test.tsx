import { configure, mount } from 'enzyme';
import { configureStore } from './redux';
import { Provider } from 'react-redux';
import * as Adapter from 'enzyme-adapter-react-16';
import * as Bluebird from 'bluebird';
import * as React from 'react';
import App from './App';

configure({ adapter: new Adapter() });

test.skip('Challenge 1: dispatching redux actions', () => {
  /**
   * The App component is set up to display the current count for the counter reducer.
   *
   * Modify the App component so that it will increment the counter by **the current count** when the #increment-btn
   * element is clicked.
   *
   * When that's done, unskip this test and run `yarn test` in a console to see the result.
   */

  const store = configureStore();
  const app = mount(<Provider store={store}><App /></Provider>);
  const button = app.find('#increment-btn');
  
  expect(app.contains(<p>{1}</p>)).toBeTruthy();
  button.simulate('click');
  expect(app.contains(<p>{2}</p>)).toBeTruthy();
  button.simulate('click');
  expect(app.contains(<p>{4}</p>)).toBeTruthy();
  button.simulate('click');
  expect(app.contains(<p>{8}</p>)).toBeTruthy();
  button.simulate('click');
  expect(app.contains(<p>{16}</p>)).toBeTruthy();
});

test.skip('Challenge 2: AsyncTracker', () => {
  /**
   * This test will have you use the AsyncTracker component to watch the progress of an asynchronous action dispatch.
   *
   * You will need to dig into the AsyncTracker.tsx file to learn how to use it.
   *
   * Modify the App component such that clicking the #delay-increment-btn element will increment the counter with a 1
   * second delay (using the `delayIncrement` action creator).
   *
   * While the increment is pending, use an AsyncTracker component to display a "Loading" indicator using a span element
   * like so: `<span>Loading...</span>`.
   *
   * Hint: The async ID for the delayIncrement action creator is `delay-increment`.
   *
   * Bonus 1: When the increment is complete, use an AsyncTracker callback to emit a log message with whatever you like.
   * 
   * Bonus 2: Find a way to test the logging behavior.
   *
   * Bonus 3: Make the test run faster by using Jest's timer mocks.
   */

  const store = configureStore();
  const app = mount(<Provider store={store}><App /></Provider>);
  const button = app.find('#delay-increment-btn');
  
  expect(app.contains(<p>{1}</p>)).toBeTruthy();
  expect(app.contains(<span>Loading...</span>)).toBeFalsy();
  button.simulate('click');
  expect(app.contains(<p>{1}</p>)).toBeTruthy();
  expect(app.contains(<span>Loading...</span>)).toBeTruthy();

  return Bluebird.delay(2000).then(() => {
    expect(app.contains(<p>{2}</p>)).toBeTruthy();
  });  
});

test.skip('Challenge 3: Beautify');
/**
 * This (optional) challenge has no tests. The only goal here is to take the butt-ugly App component and make it
 * beautiful! This is a chance to show off your design ability. You are free to add any CSS framework you like.
 * There are only a few constraints here:
 *
 * - All tests must still pass (it is OK to modify the tests a bit to accomodate changes in the DOM structure).
 * - Feel free to add new elements for layout/style, but don't add any extra functionality beyond the counter.
 * - The layout must be responsive from 420px wide all the way to 1080p.
 */
