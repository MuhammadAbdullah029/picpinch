(function () {
  ['dragover', 'drop'].forEach(function (evt) {
    window.addEventListener(evt, function (e) {
      e.preventDefault();
    });
  });

  var form = document.getElementById('compress-form');
  if (!form) return;

  var zone = document.getElementById('dropzone-zone');
  var input = document.getElementById('image-input');
  var selectedRow = document.getElementById('dropzone-selected');
  var filenameEl = document.getElementById('dropzone-filename');
  var clearBtn = document.getElementById('dropzone-clear');
  var errorEl = document.getElementById('dropzone-error');
  var loader = document.getElementById('compress-loader');
  var loaderText = document.getElementById('loader-text');
  var submitBtn = form.querySelector('.dropzone__submit');

  var MAX_BYTES = 20 * 1024 * 1024; // 20 MB
  var ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  function formatSize(bytes) {
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
    return Math.max(1, Math.round(bytes / 1024)) + ' KB';
  }

  function showError(message) {
    input.value = ''; // FIX 1: throw away the bad file
    errorEl.textContent = message;
    errorEl.hidden = false;
    selectedRow.hidden = true;
  }

  function showSelected(file) {
    errorEl.hidden = true;
    filenameEl.textContent = file.name + ' \u2014 ' + formatSize(file.size);
    selectedRow.hidden = false;
  }

  function handleFiles(files) {
    if (!files || !files.length) return;
    var file = files[0];

    // FIX 2: check the type (drag and drop skips "accept")
    if (ALLOWED_TYPES.indexOf(file.type) === -1) {
      showError('Please choose a JPG, PNG or WebP photo.');
      return;
    }
    if (file.size > MAX_BYTES) {
      showError('That photo is over 20 MB. Try a smaller one.');
      return;
    }
    showSelected(file);
  }

  input.addEventListener('change', function () {
    handleFiles(input.files);
  });

  ['dragover', 'dragenter'].forEach(function (evt) {
    zone.addEventListener(evt, function (e) {
      e.preventDefault();
      zone.classList.add('is-dragover');
    });
  });

  ['dragleave', 'dragend'].forEach(function (evt) {
    zone.addEventListener(evt, function () {
      zone.classList.remove('is-dragover');
    });
  });

  zone.addEventListener('drop', function (e) {
    e.preventDefault();
    zone.classList.remove('is-dragover');
    if (e.dataTransfer && e.dataTransfer.files.length) {
      input.files = e.dataTransfer.files;
      handleFiles(input.files);
    }
  });

  clearBtn.addEventListener('click', function () {
    input.value = '';
    selectedRow.hidden = true;
    errorEl.hidden = true;
  });

  // Loader
  var messages = [
    'Squeezing out extra pixels',
    'Shaking out the extra bytes',
    'Making it light as a feather',
    'Almost there\u2026'
  ];
  var timer;

  form.addEventListener('submit', function (e) {
    setTimeout(function () {
      if (e.defaultPrevented || !form.checkValidity()) return;

      loader.hidden = false;
      submitBtn.disabled = true;

      var i = 0;
      timer = setInterval(function () {
        i = (i + 1) % messages.length;
        loaderText.textContent = messages[i];
      }, 2000);
    }, 0);
  });

  window.addEventListener('pageshow', function () {
    loader.hidden = true;
    submitBtn.disabled = false;
    clearInterval(timer);
  });

  document.querySelectorAll('.toast').forEach(function (toast) {
    setTimeout(function () {
      toast.style.transition = 'opacity .3s ease';
      toast.style.opacity = '0';
      setTimeout(function () {
        toast.remove();
      }, 300);
    }, 4000);
  });
})();