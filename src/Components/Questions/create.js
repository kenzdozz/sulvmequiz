import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FroalaEditor from 'react-froala-wysiwyg';
import Popup from 'react-popup';
import $ from 'jquery'
import Header from '../Header';
import { fetchCall, constants, popup, Loading } from '../../helper';

// Require Editor JS files.
import 'froala-editor/js/froala_editor.pkgd.min.js';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'font-awesome/css/font-awesome.css';
import '../../assests/css/wirisplugin.css';
import '../../assests/css/popup.css';
import './question.scss';

window.$ = $
window.jQuery = $
global.jQuery = $;
require('@wiris/mathtype-froala');


export default class CreateQuestion extends Component {
  constructor(props) {
    super(props);

    let editQuestion = sessionStorage.getItem('editQuestion');
    this.isEdit = !!editQuestion;
    editQuestion = editQuestion ? JSON.parse(editQuestion) : {};
    this.editQuestion = editQuestion;
    
    this.state = {
      number: editQuestion.number || sessionStorage.getItem('nextNumber') || 1,
      question: editQuestion.question || '',
      option_a: editQuestion.option_a || '',
      option_b: editQuestion.option_b || '',
      option_c: editQuestion.option_c || '',
      option_d: editQuestion.option_d || '',
      option_e: editQuestion.option_e || '',
      answer: editQuestion.answer || '',
    }
    this.config = {
      placeholderText: '',
      heightMin: 150,
      autoFocus: true,
      toolbarSticky: false,
      quickInsertButtons: [],
      imageAllowedTypes: ['jpeg', 'jpg', 'png'],
      imageUploadURL: `${constants.baseUrl}/upload-image`,
      imageEditButtons: ['imageSize', 'imageDisplay', 'imageAlign', 'imageRemove'],
      toolbarButtons: ['wirisEditor', 'bold', 'italic', 'underline', 'strikeThrough', 'insertImage', 'subscript', 'superscript', 'outdent', 'indent', 'align', 'clearFormatting', 'insertTable', 'fontSize', 'color', 'specialCharacters', '|', 'undo', 'redo'], events: {
        'froalaEditor.image.uploaded': function (e, editor, response) {
          console.log(response);
        },
      }
    }
  }

  handleFormChanges = name => val => {
    const data = {};
    let value = val;
    if (name === 'number') value = parseInt(val.target.value);
    if (name === 'answer') value = val.target.value;
    data[name] = value;
    this.setState(data);
  }

  handleSave = async (e) => {
    const loader = new Loading(e.target, 'sm');
    const item = this.state;
    let error;
    if (!item.answer) error = 'Answer is required';
    if (!item.option_d) error = 'Option D is required';
    if (!item.option_c) error = 'Option C is required';
    if (!item.option_b) error = 'Option B is required';
    if (!item.option_a) error = 'Option A is required';
    if (!item.question) error = 'Question is required';
    if (!item.number) error = 'Number is required';
    if (error) return popup('Error', error, 'error');
    loader.start();
    const data = JSON.parse(sessionStorage.getItem('locationData'));
    const url = this.isEdit ? `${this.editQuestion.id}` : `${data.category.toLowerCase()}/${data.level}`;
    const response = await fetchCall(`${constants.baseUrl}/questions/${url}`,
      this.isEdit ? 'PATCH' : 'POST', this.state);
    loader.stop();
    if (response.status >= 400) return popup('Error', response.error, 'error');
    this.props.history.push('/admin')
  }

  render() {
    return (
      <div>
        <Header title="New question" back="/admin" />
        <main>
          <div className="questions">
            <h2>{this.isEdit ? 'Edit' : 'New'} question</h2>
            <form action="">
              <div className="form-grp">
                <label htmlFor="number">Number:</label>
                <input value={this.state.number} onChange={this.handleFormChanges('number')} type="number" id="number" />
              </div>
              <div className="form-grp">
                <label className="w100" htmlFor="question">Question:</label>
                <FroalaEditor
                  tag='textarea'
                  config={this.config}
                  model={this.state.question}
                  onModelChange={this.handleFormChanges('question')}
                />
              </div>
              <div className="dflex">
                <div className="form-grp flex50">
                  <label className="w100" htmlFor="question">Option A:</label>
                  <FroalaEditor
                    tag='textarea'
                    config={this.config}
                    model={this.state.option_a}
                    onModelChange={this.handleFormChanges('option_a')}
                  />
                </div>
                <div className="form-grp flex50">
                  <label className="w100" htmlFor="question">Option B:</label>
                  <FroalaEditor
                    tag='textarea'
                    config={this.config}
                    model={this.state.option_b}
                    onModelChange={this.handleFormChanges('option_b')}
                  />
                </div>
                <div className="form-grp flex50">
                  <label className="w100" htmlFor="question">Option C:</label>
                  <FroalaEditor
                    tag='textarea'
                    config={this.config}
                    model={this.state.option_c}
                    onModelChange={this.handleFormChanges('option_c')}
                  />
                </div>
                <div className="form-grp flex50">
                  <label className="w100" htmlFor="question">Option D:</label>
                  <FroalaEditor
                    tag='textarea'
                    config={this.config}
                    model={this.state.option_d}
                    onModelChange={this.handleFormChanges('option_d')}
                  />
                </div>
                <div className="form-grp flex50">
                  <label className="w100" htmlFor="question">Option E:</label>
                  <FroalaEditor
                    tag='textarea'
                    config={this.config}
                    model={this.state.option_e}
                    onModelChange={this.handleFormChanges('option_e')}
                  />
                </div>
                <div className="form-grp flex50">
                  <label className="w100" htmlFor="question">Answer:</label>
                  <select value={this.state.answer} className="dblock" onChange={this.handleFormChanges('answer')}>
                    <option value="">Select Answer</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
                </div>
              </div>
              <div className="form-grp">
                <button onClick={this.handleSave} type="button" className="btn btn-green">Save</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    )
  }
}

ReactDOM.render(<Popup />, document.getElementById('popup'));
