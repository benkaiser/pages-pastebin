import { h, Component, render, createRef, Fragment  } from 'https://unpkg.com/preact?module';
import htm from 'https://unpkg.com/htm?module';

ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/')

// Initialize htm with Preact
const html = htm.bind(h);

const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result.split(',')[1]);
  reader.onerror = error => reject(error);
});

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

class App extends Component {
  constructor(props) {
    super(props);
    this.modeRef = createRef();
    this.state = {
      status: '',
      mode: 'ace/mode/text',
      loading: false
    };
  }

  componentDidMount() {
    this.editor = ace.edit('editor', {
      mode: this.state.mode,
      selectionStyle: "text",
      theme: 'ace/theme/chrome'
    });
  }

  render() {
    return html`
      <div className='center-container'>
        <h1>Open Pastebin - Powered by GitHub Pages + GitHub Actions</h1>
        <p>New Paste (Max size ${'<'}60kb)</p>
        ${ !this.state.status ?
          this.renderForm() :
          this.renderStatus()
        }
      </div>
    `;
  }

  renderForm() {
    const props = this.props;
    const modelist = ace.require("ace/ext/modelist");
    return html`
      <Fragment>
        <div id="editor"></div>
        <form className="pure-form pure-form-stacked">
          <fieldset>
            <label for="highlighting">Highlighting</label>
            <select name="highlighting" ref=${this.modeRef} value="${this.state.mode}" onChange=${this.onChangeMode}>
            ${modelist.modes.map(mode => {
              return (
                html`
                  <option value="${mode.mode}">${mode.name}</option>
                `
              );
            })}
            </select>
            <label for="title">Title</label>
            <input type="text" name="title" />

          </fieldset>
        </form>
        <button class="pure-button pure-button-primary">Save Paste</button>
      </Fragment>
    `;
  }

  renderStatus() {
    return html`
      <Fragment>
        <p>${this.state.status}</p>
        ${ this.state.loading ? html`<div className="spinner primary"></div> ` : ''}
      </Fragment>
    `;
  }

  onChangeMode = () => {
    const newMode = this.modeRef.current.value;
    this.setState({
      mode: newMode
    });
    this.editor.setOptions({
      mode: newMode
    });
  }

  onUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      this.setState({
        status: '',
        loading: false
      });
      return;
    }
    this.setState({
      status: 'Starting upload',
      loading: true
    });
    const base64 = await toBase64(file);
    const filename = uuidv4() + '.' + file.type.replace('image/', '');
    fetch("https://publicactiontrigger.azurewebsites.net/api/dispatches/benkaiser/pages-imgur", {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({ event_type: 'Add Image', client_payload: { data: JSON.stringify({ filename, image: base64 }) } })
    }).then((response) => {
      if (response.status === 200 || response.status === 204) {
        this.setState({
          status: 'Upload initiated. Will redirect when available (can take up to 1 minute)',
          loading: true
        });
        this.waitForImage(filename);
      } else {
        this.setState({
          status: 'Upload failed, image may be too big',
          loading: false
        });
      }
    }).catch(() => {
      this.setState({
        status: 'Upload failed, image may be too big',
        loading: false
      });
    })
  }

  waitForImage = (filename) => {
    const location = 'images/' + filename;
    setInterval(() => {
      fetch(location + '?cachebust=' + Math.random()).then((response) => {
        if (response.status === 200) {
          window.location.href = window.location.pathname + location;
        }
      });
    }, 5000);
  }
}


render(html`<${App} />`, document.getElementById('main'));
