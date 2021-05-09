ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/')

document.querySelectorAll('.editor').forEach(function(snippet) {
  // Now do something with my button
  ace.edit(snippet, {
    mode: snippet.attributes.mode.value,
    selectionStyle: "text",
    theme: 'ace/theme/chrome',
    readOnly: true,
    useWorker: false,
    maxLines: 10
  });
});