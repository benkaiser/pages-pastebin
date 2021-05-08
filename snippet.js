ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/')

ace.edit('editor', {
  mode: document.getElementById('editor').attributes.mode.value,
  selectionStyle: "text",
  theme: 'ace/theme/chrome',
  readOnly: true,
  useWorker: false
});