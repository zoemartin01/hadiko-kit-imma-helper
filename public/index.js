if (window.File && window.FileReader && window.FileList && window.Blob) {
  function showFile() {
    var messageOut = document.getElementById("messages");
    var codeInput = document.getElementById("code");
    var file = document.getElementById("imma").files[0];
    var reader = new FileReader();

    var pdfFileExtension = /pdf.*/;

    reader.onload = async (event) => {
      if (!file.type.match(pdfFileExtension)) {
        messageOut.innerHTML =
          "<span class='error'>It doesn't seem to be a pdf file!</span>";
        return;
      }

      const code_regex = /https:\/\/campus.studium.kit.edu\/verify\/(\w+)/gi;

      const document = await pdfjsLib.getDocument(event.target.result).promise;
      const page = await document.getPage(1);
      const content = await page.getTextContent();
      const text = content.items
        .map(function (item) {
          return item.str;
        })
        .join(" ");
      const result = code_regex.exec(text);

      if (result == null) {
        messageOut.innerHTML =
          "<span class='error'>No code found in pdf!</span>";
        return;
      }

      const code = result[1];

      codeInput.value = code;
      messageOut.innerHTML =
        "<span class='success'>Code found! Code: " + code + "</span>";
      page.cleanup();
    };

    reader.readAsArrayBuffer(file);
  }
} else {
  alert("Your browser is too old to support HTML5 File API");
}
