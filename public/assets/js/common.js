$(function () {
  /* Load sample */
  var files = ["acme.json", "paperflies.json", "patagonia.json"];
  var loaded = 0;
  $.each(files, function (idx, file) {
    fetch("assets/sample/" + file)
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        $("#json-input-" + idx).val(data);
      });
  });

  /* Trigger harmonize */
});

var $jsonInputsContainer = $("#json-inputs");
var $addBtn = $("#add-btn");
var $harmonizeBtn = $("#harmonize-btn");
var inputCount = 3;

function createInputBox(index) {
  var $row = $("<div>").addClass("json-input-row");
  var $textarea = $("<textarea>")
    .attr("placeholder", `Paste JSON #${index + 1}`)
    .attr("id", `json-input-${index}`);
  $row.append($textarea);
  return $row;
}

function renderInputs() {
  $jsonInputsContainer.empty();
  for (var i = 0; i < inputCount; i++) {
    $jsonInputsContainer.append(createInputBox(i));
  }
}

$addBtn.on("click", function () {
  inputCount++;
  renderInputs();
});

renderInputs();

var viewer = new JSONEditor(document.getElementById("json-viewer"), {
  mode: "view",
  mainMenuBar: false,
  navigationBar: false,
  statusBar: false,
});

$harmonizeBtn.on("click", function () {
  var jsons = [];
  for (var i = 0; i < inputCount; i++) {
    var val = $("#json-input-" + i)
      .val()
      .trim();
    if (val) {
      try {
        jsons.push(JSON.parse(val));
      } catch (e) {
        alert(`Input #${i + 1} is not valid JSON.`);
        return;
      }
    }
  }
  viewer.set(jsons);
});
