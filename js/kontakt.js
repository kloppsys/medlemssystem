(function () {
    var form = document.getElementById("contactForm");
    if (!form) return;

    var submitButton = document.getElementById("contactSubmit");
    var status = document.getElementById("formStatus");

    function showStatus(kind, message) {
        status.textContent = message;
        status.className = "form-status is-" + kind;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var formData = new FormData(form);
        if (formData.get("botcheck")) {
            return;
        }

        var payload = Object.fromEntries(formData);
        submitButton.disabled = true;
        submitButton.textContent = "Sender ...";
        status.className = "form-status";
        status.textContent = "";

        fetch(form.action, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(payload),
        })
            .then(function (response) {
                return response.json().then(function (json) {
                    return { ok: response.ok, json: json };
                });
            })
            .then(function (result) {
                if (result.ok) {
                    form.reset();
                    showStatus("success", "Takk! Henvendelsen er sendt. Vi svarer så raskt vi kan.");
                } else {
                    showStatus(
                        "error",
                        "Noe gikk galt: " + (result.json && result.json.message ? result.json.message : "ukjent feil") + ". Prøv igjen, eller ring 33 31 28 00."
                    );
                }
            })
            .catch(function () {
                showStatus("error", "Kunne ikke sende henvendelsen. Sjekk nettforbindelsen og prøv igjen, eller ring 33 31 28 00.");
            })
            .finally(function () {
                submitButton.disabled = false;
                submitButton.textContent = "Send henvendelse";
            });
    });
})();
