import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';
import './quiz.scss';

export default class QuizQuestion extends Component {
  constructor (props) {
    super(props);
    this.state = {
      quiz: {},
      question: {},
      questions: [],
      timer: 0,
      showAnswer: false,
      next: null,
      prev: null,
    }
  }

  timerInterval;

  componentDidMount() {
    const { data } = this.props.location;
    if (!data) return this.props.history.push({
      pathname: '/quiz',
    });
    const { timer } = data.quiz;
    const { questions } = data;
    const question = questions[0];
    if (!question) return this.backToQuestions();
    
    const next = questions[1] || null;
    this.setState({ ...data, timer, question, next });
    this.startTimer();
  }

  backToQuestions = () => {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.props.history.push({
      pathname: '/quiz',
    });
  }

  showAnswer = () => {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.setState({ showAnswer: true });
  }

  startTimer = () => {
    this.timerInterval = setInterval(() => {
      const timer = this.state.timer - 1;
      if (!timer) this.showAnswer();
      this.setState({ timer });
    }, 1000);
  }

  switchQuestion = (question) => (e) => {
    if (this.timerInterval) clearInterval(this.timerInterval);
    const index = this.state.questions.indexOf(question);
    const next = this.state.questions[index + 1] || null;
    const prev = this.state.questions[index - 1] || null;
    const { timer } = this.state.quiz;
    this.setState({ prev, question, next, timer, showAnswer: false }, () => {
      this.startTimer();
    });
  }

  render() {
    return (
      <React.Fragment>
        <header className="py-05 text-right">
            <button onClick={this.backToQuestions} className="btn btn-sm mr-1">Back to Questions</button>
            <button onClick={this.showAnswer} className="btn btn-sm btn-green">Show Answer</button>
        </header>
        <div className="quiz-wrapper">
          <div className="container p-1">
            <div className="ques-timer">
              <div className="question">
                <span className="ques-no">{ this.state.question.number }</span>
                <h1 className="mt-0">{ ReactHtmlParser(this.state.question.question) }</h1>
              </div>
              <div className="timer">
                <span>Timer</span>
                <div className="time">{ this.state.timer }</div>
              </div>
            </div>
            <h3 className="text-center">Options</h3><hr/>
            <div className={'dflex' + (this.state.showAnswer ? ' show-answer':'')}>
              <div className={'option flex50' + (this.state.question.answer === 'A' ? ' answer':'')}>
                <div className="card">
                  <span className="ques-no">A</span>
                  <div>{ ReactHtmlParser(this.state.question.option_a) }</div>
                </div>
              </div>
              <div className={'option flex50' + (this.state.question.answer === 'B' ? ' answer':'')}>
                <div className="card">
                  <span className="ques-no">B</span>
                  <div>{ ReactHtmlParser(this.state.question.option_b) }</div>
                </div>
              </div>
              <div className={'option flex50' + (this.state.question.answer === 'C' ? ' answer':'')}>
                <div className="card">
                  <span className="ques-no">C</span>
                  <div>{ ReactHtmlParser(this.state.question.option_c) }</div>
                </div>
              </div>
              <div className={'option flex50' + (this.state.question.answer === 'D' ? ' answer':'')}>
                <div className="card">
                  <span className="ques-no">D</span>
                  <div>{ ReactHtmlParser(this.state.question.option_d) }</div>
                </div>
              </div>
              <div className={'option flex50' + (this.state.question.answer === 'E' ? ' answer':'')}>
                <div className="card">
                  <span className="ques-no">E</span>
                  <div>{ ReactHtmlParser(this.state.question.option_e) }</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button onClick={this.switchQuestion(this.state.prev)} className={'arrow left' + (this.state.prev ? ' show':'')} title="Previous">
          <svg width="22px" height="80px" viewBox="0 0 50 80" xml="true">
            <polyline fill="none" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" points="
          45.63,75.8 0.375,38.087 45.63,0.375 "/>
          </svg>  
        </button>
        <button onClick={this.switchQuestion(this.state.next)} className={'arrow right' + (this.state.next ? ' show':'')} title="Next">
          <svg width="22px" height="80px" viewBox="0 0 50 80" xml="true">
            <polyline fill="none" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" points="
          0.375,0.375 45.63,38.087 0.375,75.8 "/>
          </svg>
        </button>
      </React.Fragment>
    )
  }
}
