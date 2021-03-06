import React, { Component } from 'react';
import { popup, fetchCall } from '../../helper';
import './index.scss';
import logo from '../../assests/logo.png';

export default class Home extends Component {
  constructor (props) {
    super(props);
    this.state = {
      category: 'Junior',
      level: '1',
      questions: '',
      setup: false,
      manage: false,
      phase: 1,
      timer: 0
    }
  }

  handleFormChange = (name) => (e) => {
    const data = {};
    data[name] = e.target.value;
    this.setState(data);
  }

  setPhase = (e) => {
    this.setState({
      phase: parseInt(e.target.value, 10)
    });
  }

  setUp = (manage) => () => {
    this.setState({
      setup: !this.state.setup,
      manage
    });
  }

  startAction = async () => {
    const path = this.state.manage ? '/admin' : '/';
    const data = {
      category: this.state.category,
      level: parseInt(this.state.level),
      questions: this.state.questions,
      timer: this.state.timer,
    }
    if (!this.state.manage && !data.timer)
      return popup('Error', 'Time for each question is required.', 'error');
    if (this.state.phase === 2 && !this.state.manage && !data.questions)
      return popup('Error', 'Questions are required.', 'error');

    if (this.state.phase === 2 && !this.state.manage) {
      const qNumbers = data.questions.split(' ');
      const response = await fetchCall(`/questions/${data.category.toLowerCase()}/${data.level}?goto=${data.questions}&limit=500`);
      if (qNumbers.length !== response.count) {
        let resNumbers = response.data.map(a => a.number);
        let notExist = qNumbers.filter(e => !resNumbers.includes(parseInt(e, 10)));
        notExist = notExist.join(', ');
        console.log(qNumbers, response)
        return popup('Error', `This question number(s): ${notExist} does not exist.`, 'error');
      }
    }
    
    if (!this.state.manage) await fetchCall('/quiz', 'POST', data);

    this.props.history.push({
      pathname: path,
      data: data
    });
  }

  render() {
    const homePage = (
      <div className="home">
        <img src={logo} alt=""/>
        <h1>Sulvme Mathematics Competition</h1>
        <div className="mt-1">
          <button onClick={this.setUp(true)} className="btn btn-blue">Manage Questions</button>
          <button onClick={this.setUp(false)} className="btn btn-green">Start Quiz</button>
        </div>
      </div>
    );
    const setUp = (
      <div className="home">
        <h1>Sulvme Mathematics Competition</h1>
        <select onChange={this.handleFormChange('category')} className="w60">
          <option value="Junior">Junior</option>
          <option value="Senior">Senior</option>
        </select>
        <select onChange={this.handleFormChange('level')} className="w60 mt-1">
          <option value="1">Level One</option>
          <option value="2">Level Two</option>
          <option value="3">Level Three</option>
          <option value="4">Level Four</option>
          <option value="5">Level Five</option>
        </select>
        <div className={ (this.state.manage ? 'hide':'') + ' mt-1 w60 text-center'}>
          <input type="number" onChange={this.handleFormChange('timer')} className="mt-1 mb-1 w50 text-center" placeholder="Time in secs"/>
          <div className="w100">
            <label htmlFor="phase1" className="mr-1">
              <input onChange={this.setPhase} type="radio" name="phase" value="1" id="phase1"/>
              <span>Phase one</span>
            </label>
            <label htmlFor="phase2">
              <input onChange={this.setPhase} type="radio" name="phase" value="2" id="phase2"/>
              <span>Phase two</span>
            </label>
          </div>
          <input type="text" onChange={this.handleFormChange('questions')} className={ (this.state.phase === 1 ? 'hide':'') + ' mt-1 w80 text-center'} placeholder="Enter questions, separate with space"/>
        </div>
        <div className="mt-2">
          <button onClick={this.startAction} className={'btn btn-'+(this.state.manage ? 'blue':'green')}>
            { this.state.manage ? 'Manage':'Start' }
          </button>
          <button onClick={this.setUp('')} className="btn btn-gray">Back</button>
        </div>
      </div>
    );
    return (
      <div className="home-wrap">
        {this.state.setup ? setUp : homePage}
      </div>
    )
  }
}
