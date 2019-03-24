import React from 'react';
import ReactDOM from 'react-dom';
import { Route, HashRouter as Router } from 'react-router-dom';
import './index.scss';
import Home from './Components/Home'
import Questions from './Components/Questions'
import * as serviceWorker from './serviceWorker';
import CreateQuestion from './Components/Questions/create';
import Quiz from './Components/Quiz/quiz';
import QuizQuestion from './Components/Quiz/question';

ReactDOM.render(<Router>
  <React.Fragment>
    <Route exact path="/" component={Home} />
    <Route exact path="/admin" component={Questions} />
    <Route exact path="/admin/create" component={CreateQuestion} />
    <Route exact path="/quiz" component={Quiz} />
    <Route exact path="/quiz/question" component={QuizQuestion} />
  </React.Fragment>
</Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
