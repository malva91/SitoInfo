document.addEventListener("DOMContentLoaded", () => {
    const uniqueId = Date.now();
    const loginContainer = document.createElement("div");
    loginContainer.className = "login-container";

    loginContainer.innerHTML = `
        <div class="login-modal">
            <div style="text-align: center">
                <a href="/info.html" class="btn btn-custom-4 text-white">
                    <span class="btn-content">Torna indietro</span>
                </a>
            </div>

            <h2 class="login-title">✨ Accesso WebApp</h2>

            <div class="login-content">
                <form id="loginForm_${uniqueId}">
                    <div class="form-group">
                        <label for="username_${uniqueId}">Dipendente</label>
                        <select id="username_${uniqueId}" class="form-control" required>
                            <option value="">Seleziona dipendente</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="password_${uniqueId}">Password</label>
                        <input type="password" id="password_${uniqueId}" class="form-control" required>
                    </div>

                    <button type="submit" class="login-btn">Accedi</button>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(loginContainer);

    const usernameSelect = document.getElementById(`username_${uniqueId}`);
    const loginForm = document.getElementById(`loginForm_${uniqueId}`);

    employees
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((employee) => {
            const option = document.createElement("option");
            option.value = employee.name;
            option.textContent = employee.name;
            usernameSelect.appendChild(option);
        });

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = usernameSelect.value;
        const password = document.getElementById(`password_${uniqueId}`).value;
        const employee = employees.find(emp => emp.name === username);

        if (employee && employee.password === password) {
            sessionStorage.setItem("loggedUser", username);
            window.location.href = "webApp_Ore.html";
        } else {
            alert("Credenziali non valide");
        }
    });
});