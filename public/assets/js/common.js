const jsonInputsContainer = document.getElementById("json-inputs");
const addBtn = document.getElementById("add-btn");
const harmonizeBtn = document.getElementById("harmonize-btn");
let inputCount = 3;

function createInputBox(index) {
  const row = document.createElement("div");
  row.className = "json-input-row";
  const textarea = document.createElement("textarea");
  textarea.placeholder = `Paste JSON #${index + 1}`;
  textarea.id = `json-input-${index}`;
  row.appendChild(textarea);
  return row;
}

function renderInputs() {
  jsonInputsContainer.innerHTML = "";
  for (let i = 0; i < inputCount; i++) {
    jsonInputsContainer.appendChild(createInputBox(i));
  }
}

addBtn.addEventListener("click", () => {
  inputCount++;
  renderInputs();
});

renderInputs();

// JSON Viewer
const viewer = new JSONEditor(document.getElementById("json-viewer"), {
  mode: "view",
  mainMenuBar: false,
  navigationBar: false,
  statusBar: false,
});

harmonizeBtn.addEventListener("click", () => {
  const jsons = [];
  for (let i = 0; i < inputCount; i++) {
    const val = document.getElementById(`json-input-${i}`).value.trim();
    if (val) {
      try {
        jsons.push(JSON.parse(val));
      } catch (e) {
        alert(`Input #${i + 1} is not valid JSON.`);
        return;
      }
    }
  }
  // For demo, just merge all objects into an array
  viewer.set(jsons);
});
