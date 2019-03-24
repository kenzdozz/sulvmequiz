import React, { Component } from 'react';
import './question.scss';
import Header from '../Header';
import Question from './question';
import { fetchCall, popup, Loading } from '../../helper';

export default class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      locationData: {},
      nextNumber: 1,
      pageCount: 1,
      page: 1,
      goto: '',
      isGoto: false,
    };
  }

  componentDidMount() {
    sessionStorage.removeItem('editQuestion');
    sessionStorage.removeItem('nextNumber');
    this.fetchPopulate();
  }

  fetchPopulate = async () => {
    let { data } = this.props.location;
    if (!data) {
      data = sessionStorage.getItem('locationData');
      if (!data) return this.props.history.push('/');
      data = JSON.parse(data);
    } else sessionStorage.setItem('locationData', JSON.stringify(data));
    this.setState({ locationData: data });
    const response = await fetchCall(
      `/questions/${data.category.toLowerCase()}/${data.level}?page=${this.state.page}&goto=${this.state.goto}`, 
      'GET'
    );
    const questions = response.data;
    const pageCount = response.pageCount;
    this.setState({ questions, pageCount });
    if (questions.length) 
      sessionStorage.setItem('nextNumber', questions[questions.length - 1].number + 1);
  }

  setPage = (action) => () => {
    let page = this.state.page;
    if (!action) page = (page > 1) ? page - 1 : 1;
    else page = (page < this.state.pageCount) ? page + 1 : this.state.pageCount;
    this.setState({ page }, () => this.fetchPopulate());
    console.log(this.state.pageCount, page)
  }

  gotoQuestion = (e) => {
    e.preventDefault();
    const goto = e.target.elements.goto.value;
    const isGoto = !!goto;
    if (goto || this.state.isGoto) this.setState({ goto, isGoto }, () => this.fetchPopulate());
  }

  setGoto = (e) => {
    const goto = e.target.value;
    this.setState({ goto });
  }

  clearGoto = () => {
    this.setState({ isGoto: false, goto: '' }, () => this.fetchPopulate());
  }

  deleteQuestion = question => async (e) => {
    if(!window.confirm('Continue to delete this question?')) return;
    const loader = new Loading(e.target, 'sm');
    loader.start();
    const response = await fetchCall(`/questions/${question.id}`, 'DELETE');
    if (response.status >= 400) {
      loader.stop();
      return popup('Error', response.error, 'error');
    }
    const questions = this.state.questions;
    questions.pop(question);
    this.setState(questions);
    const nextNumber = questions.length ? questions[questions.length - 1].number + 1 : 1;
    sessionStorage.setItem('nextNumber',  nextNumber);
  }

  getLevel = level => {
    switch (level) {
      case 1:
        return 'One';
      case 2:
        return 'Two';
      case 3:
        return 'Three';
      case 4:
        return 'Four';
      default:
        return 'Five';
    }
  }

  getEmpty = () => {
    if (!this.state.questions.length) {
      return (
        <p className="text-center">No questions found!</p>
      )
    }
  }

  newQuestion = e => {
    new Loading(e.target, 'sm').start();
    setTimeout(() => {
      this.props.history.push({
        pathname: '/admin/create'
      });
    }, 1000);
  }

  render() {
    return (
      <div className="app">
        <Header title="Manage Questions" />
        <main>
          <div className="goto">
            <h2 className="mt-1">{this.state.locationData.category} Category, Level {this.getLevel(this.state.locationData.level)} Questions</h2>
            <form onSubmit={this.gotoQuestion} className="mb-1">
              <input onChange={this.setGoto} name="goto" value={this.state.goto} type="text" />
              <button className="btn btn-sm btn-gold">Goto</button>
              <button onClick={this.clearGoto} type="button" className={ (this.state.isGoto ? '':'hide') + ' btn btn-sm btn-green'}>Get all</button>
            </form>
          </div>
          <div className="questions">
            <button onClick={this.newQuestion} className="btn btn-green create">New question</button>
            <h3>Questions</h3><hr />
            <div className="quests">
              {this.state.questions.map(question => <Question item={question} key={question.id} deleteQuestion={this.deleteQuestion} />)}
              {this.getEmpty()}
            </div>
            <div className={this.state.pageCount < 2 ? 'hide':''}>
              <button onClick={this.setPage(0)} className={(this.state.page <= 1 ? 'disabled':'') + ' btn btn-sm'}>&larr; Prev</button>
              <button onClick={this.setPage(1)} className={(this.state.page >= this.state.pageCount ? 'disabled':'') + ' btn btn-sm'}>Next &rarr;</button>
              <div className='inline ml-1'>{this.state.page} of {this.state.pageCount} pages</div>
            </div>
          </div>
        </main>
      </div>
    )
  }
}
