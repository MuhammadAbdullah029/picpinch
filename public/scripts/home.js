/* -------------------------------------------------
   PicPinch — upload interactions
   The form works fine without this file (it's a normal
   <input type="file"> under the hood). This just adds
   drag-and-drop, a filename preview, and friendlier
   error text than the browser gives you by default.
------------------------------------------------- */
(function () {
  // If someone drops a photo outside the dropzone, stop the
  // browser from navigating away to show the image full-page.
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

  var MAX_BYTES = 20 * 1024 * 1024; // 20 MB

  function formatSize(bytes) {
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
    return Math.max(1, Math.round(bytes / 1024)) + ' KB';
  }

  function showError(message) {
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

    // Example: a .png renamed to .jpg still reports as image/png here,
    // so this checks the real file content, not just the extension.
    if (file.type !== 'image/jpeg') {
      showError('That\u2019s not a JPG. PicPinch only pinches JPG photos for now.');
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

  // Toasts say their piece once, then get out of the way.
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