
import Popup from 'react-popup';

const constants = {
  port: 3030,
  baseUrl: 'http://localhost:'
}
constants.baseUrl += `${constants.port}`;


const fetchCall = async (url, method, data) => {
  const config = {
    method,
    mode: 'cors',
    dataType: 'json',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  };
  if (data) config.body = JSON.stringify(data);
  try {
    const resData = await fetch(`${constants.baseUrl}${url}`, config);
    const response = await resData.json();
    return response;
  } catch (error) {
    console.log(error);
    window.alert('Error occured, Please restart app.');
    return {};
  }
}

const popup = (title, content, type = null, cancel = false) => {
  const config = {
    title,
    content,
    buttons: {
      right: ['ok']
    }
  }
  if (type === 'error') config.className = 'error';
  if (type === 'cancel' || cancel) config.buttons.left = ['cancel'];
  return Popup.queue(Popup.register(config));
}

class Loading {
  constructor(element, classNames = '') {
      this.element = element;
      this.element.classList.add('isloading');
      this.loader = document.createElement('span');
      this.loader.classList.add('loader');
      this.loader.innerHTML = `
      <svg class="${classNames}" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve">
          <rect x="0" y="10" width="4" height="10" class="svg-rect" fill="#333" opacity="0.2">
          <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
          </rect>
          <rect x="8" y="10" width="4" height="10" class="svg-rect" fill="#333"  opacity="0.2">
          <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
          </rect>
          <rect x="16" y="10" width="4" height="10" class="svg-rect" fill="#333"  opacity="0.2">
          <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
          </rect>
      </svg>`
      return this;
  }
  start() {
      this.element.appendChild(this.loader);
      this.element.classList.add('progress');
  }
  stop() {
      this.element.removeChild(this.loader);
      this.element.classList.remove('progress');
      this.element.classList.remove('isloading');
  }
}

export { constants, fetchCall, popup, Loading };
