import React, { Component } from 'react';
import { withRouter} from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import './question.scss';
import { Loading } from '../../helper';

class Question extends Component {
  editQuestion = question => (e) => {
    new Loading(e.target, 'sm').start();
    sessionStorage.setItem('editQuestion', JSON.stringify(question));
    setTimeout(() => {
      this.props.history.push({
        pathname: '/admin/create'
      });
    }, 1000);
  }

  getOptionE = (option_e) => {
    if (option_e) {
      return (
        <div className="option">
          <span className="number">E: </span>
          {ReactHtmlParser(option_e)}
        </div>
      )
    }
  }

  render() {
    return (
      <div className="quest">
        <div className="question">
          <span className="number">{this.props.item.number}. </span>
          {ReactHtmlParser(this.props.item.question)}
        </div>
        <div className="options">
          <div className="option">
            <span className="number">A: </span>
            {ReactHtmlParser(this.props.item.option_a)}
          </div>
          <div className="option">
            <span className="number">B: </span>
            {ReactHtmlParser(this.props.item.option_b)}
          </div>
          <div className="option">
            <span className="number">C: </span>
            {ReactHtmlParser(this.props.item.option_c)}
          </div>
          <div className="option">
            <span className="number">D: </span>
            {ReactHtmlParser(this.props.item.option_d)}
          </div>
          { this.getOptionE(this.props.item.option_e) }
          <div className={`option action ${this.props.item.option_e ? '':'f100'}`}>
            <span className="answer mr-1">Answer: {this.props.item.answer}</span>
            <button onClick={this.editQuestion(this.props.item)} className="btn btn-sm btn-blue">Edit</button>
            <button onClick={this.props.deleteQuestion(this.props.item)} className="btn btn-sm btn-red">Delete</button>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Question);
