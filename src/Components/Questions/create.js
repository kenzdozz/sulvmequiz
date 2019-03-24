import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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

const FroalaEditor = React.lazy(() => import('react-froala-wysiwyg'));

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
      hasError: false,
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
      imageUploadParam: 'image',
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
    const response = await fetchCall(`/questions/${url}`,
      this.isEdit ? 'PATCH' : 'POST', this.state);
    loader.stop();
    if (response.status >= 400) return popup('Error', response.error, 'error');
    this.props.history.push('/admin')
  }

  loadFroala = field => {
    return (
      <FroalaEditor
        tag='textarea'
        config={this.config}
        model={this.state[field]}
        onModelChange={ this.handleFormChanges(field) }
      />
    );
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true });
  }

  componentDidMount() {
    console.log('oooo')

    setTimeout(() => {
      // this.setState({ hasError: true });
      if (this.refs.fallback) console.log('oo')
    }, 100);
    console.log(this.refs.fallback)
  }

  reload = e => {
    new Loading(e.target, 'sm').start();
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <React.Fragment>
          <Header title="New question" back="/admin" />
          <main className="dflex">
            <div className="card-box">
              <p>No or poor internet connection, please try again.</p>
              <button onClick={this.reload} className="btn btn-gold">Reload</button>
            </div>
          </main>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
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
                  <React.Suspense maxDuration={1000} fallback={<small className="fload">Loading...</small>}>
                    { this.loadFroala('question') }
                  </React.Suspense>
              </div>
              <div className="dflex">
                <div className="form-grp flex50">
                  <label className="w100" htmlFor="question">Option A:</label>
                  <React.Suspense maxDuration={1000} fallback={<small className="fload">Loading...</small>}>
                    { this.loadFroala('option_a') }
                  </React.Suspense>
                </div>
                <div className="form-grp flex50">
                  <label className="w100" htmlFor="question">Option B:</label>
                  <React.Suspense maxDuration={1000} fallback={<small className="fload">Loading...</small>}>
                    { this.loadFroala('option_b') }
                  </React.Suspense>
                </div>
                <div className="form-grp flex50">
                  <label className="w100" htmlFor="question">Option C:</label>
                  <React.Suspense maxDuration={1000} fallback={<small className="fload">Loading...</small>}>
                    { this.loadFroala('option_c') }
                  </React.Suspense>
                </div>
                <div className="form-grp flex50">
                  <label className="w100" htmlFor="question">Option D:</label>
                  <React.Suspense maxDuration={1000} fallback={<small className="fload">Loading...</small>}>
                    { this.loadFroala('option_d') }
                  </React.Suspense>
                </div>
                <div className="form-grp flex50">
                  <label className="w100" htmlFor="question">Option E:</label>
                  <React.Suspense maxDuration={1000} fallback={<small className="fload" ref="fallback">Loading...</small>}>
                    { this.loadFroala('option_e') }
                  </React.Suspense>
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
      </React.Fragment>
    )
  }
}

ReactDOM.render(<Popup />, document.getElementById('popup'));
