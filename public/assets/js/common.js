$(async function () {
  $("#add-btn").click(function () {
    const index = $("#json-inputs .json-input-row").length;
    const inputRow = `
    <div class="json-input-row">
     <textarea placeholder="Paste JSON #${index + 1}" id="json-input-${index}"></textarea>
    </div>`;

    $("#json-inputs").append(inputRow);
  });

  $("#harmonize-btn").click(function () {
    harmonize();
  });

  /* Render inputs first, then load samples, then trigger harmonize */
  [...Array(3)].forEach(() => $("#add-btn").click());
  await loadSample();
  await harmonize();
});

const viewer = new JSONEditor($("#json-viewer").get(0), {
  mode: "view",
  mainMenuBar: false,
  navigationBar: false,
  statusBar: false,
});

const loadSample = async () => {
  const files = ["acme.json", "paperflies.json", "patagonia.json"];

  const loadPromises = files.map((file, idx) =>
    fetch("assets/sample/" + file)
      .then((res) => res.text())
      .then((data) => {
        $("#json-input-" + idx).val(data);
      })
  );

  await Promise.all(loadPromises);
};

const harmonize = async () => {
  const jsonList = $(".json-input-row textarea")
    .map(function () {
      return $(this).val().trim();
    })
    .get()
    .filter((val) => val);

  if (jsonList.length === 0) {
    return;
  }

  const ids = $("#filter-hotel-id").val().trim();
  const destinationIds = $("#filter-destination-id").val().trim();

  try {
    const response = await fetch("/harmonize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jsonList, ids, destinationIds }),
    });
    const result = await response.json();
    if (result.success) {
      viewer.set(JSON.parse(result.data));
      viewer.expandAll();
    } else {
      alert("Error: " + result.message);
    }
  } catch (err) {
    alert("Error: " + err.message);
  }
};
