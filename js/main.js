const formCadastro = document.getElementById("formCadastro");

formCadastro.addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = document.getElementById("name").value;
  const username = document.getElementById("username").value;
  const avatar = document.getElementById("avatar").value;
  const senha = document.getElementById("senha").value;

  const data = {
    name: nome,
    username: username,
    avatar_url: avatar,
    password: senha,
  };

  postJSON(data, "http://192.168.89.186:8087/api/v1/users/");

  console.log("enviou!" + JSON.stringify(data));
});

async function postJSON(data, url) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}
