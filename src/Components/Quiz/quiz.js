import React, { Component } from 'react';
import './quiz.scss';
import { fetchCall, popup } from '../../helper';

export default class Quiz extends Component {
  constructor (props) {
    super(props);
    this.state = {
      answered_numbers: null,
      category: "",
      createdAt: "",
      id: null,
      level: null,
      questions: "",
      status: true,
      updatedAt: "",
      numbersAnswered: [],
      qNumber: null,
    }
  }

  async componentDidMount() {
    const response = await fetchCall('/quiz/latest');
    const quiz = response.data;
    let numbersAnswered = quiz.answered_numbers ? quiz.answered_numbers.split(',') : [];
    if (quiz.questions)
      numbersAnswered = quiz.questions.split(' ');
    this.setState({
      ...quiz,
      numbersAnswered,
    });
    console.log(quiz)
  }

  handleFormChange = (name) => (e) => {
    const data = {};
    data[name] = e.target.value;
    this.setState(data);
  }

  gotoNumber = async () => {
    const quiz = {
      id: this.state.id,
      questions: this.state.questions,
      qNumber: this.state.qNumber,
      category: this.state.category,
      level: this.state.level,
      timer: this.state.timer,
    }
    if (!quiz.questions) {
      if (!quiz.qNumber) return popup('Error', 'Kindly enter the question number.', 'error');
      if (this.state.numbersAnswered.includes(quiz.qNumber)) 
        return popup('Error', 'This question has been answered.', 'error');
    }

    const goto = quiz.questions ? quiz.questions : quiz.qNumber;

    const response = await fetchCall(`/questions/${quiz.category.toLowerCase()}/${quiz.level}/?goto=${goto}&limit=500`);
    if (!response.status || response.status >= 400)
      return popup('Error', response.error, 'error');
    
    const questions = response.data;

    if (!quiz.questions) {
      await fetchCall(`/quiz/${quiz.id}`, 'PATCH', {
        numbers: this.state.answered_numbers ? 
          this.state.answered_numbers + ',' + quiz.qNumber : quiz.qNumber,
      });
    }

    this.props.history.push({
      pathname: '/quiz/question',
      data: { quiz, questions },
    });
  }

  endQuiz = async () => {
    const check = window.confirm('End this quiz session?');
    if (!check) return;
    await fetchCall(`/quiz/end/${this.state.id}`);
    this.props.history.push({
      pathname: '/',
    });
  }
  
  render() {
    const showNumber = (num, index) => {
      return (
        <span key={'num-' + index} className="item">{num}</span>
      );
    }
    const showAction = () => {
      if (this.state.questions) return (
        <React.Fragment>
          <h1 className="mt-0">Questions Loaded</h1>
          <button onClick={this.gotoNumber} className="btn">Start</button>
        </React.Fragment>
      );
      return (
        <React.Fragment>
          <h1 className="mt-0">Choose Question</h1>
          <input type="text" onChange={this.handleFormChange('qNumber')} pattern="[\d]+" title="Only numbers allowed." placeholder="0"/><br/>
          <button onClick={this.gotoNumber} className="btn">Goto</button>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <header>
          <div className="text-center">
            <button onClick={this.endQuiz} className="btn btn-tny btn-gold endbtn">End Quiz</button>
            <em>Sulvme Mathematics Competition</em>
          </div>
        </header>
        <div className="quiz-wrapper">
          <div className="container">
            <div className="choose">{showAction()}</div>
            <h3 className="text-center">{ this.state.questions ? 'Selected' : 'Answered' } Questions</h3>
            <div className="answered">
              {this.state.numbersAnswered.map((number, index) => showNumber(number, index))}
              <p className={(this.state.numbersAnswered.length ? 'hide' : '') + ' mt-2'}>No answered questions.</p>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
