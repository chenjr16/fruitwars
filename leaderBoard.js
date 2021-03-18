// Remote
const backend = "https://fruitwars.herokuapp.com/";

// local
// const backend = "http://localHost:8080/";

//displaying the player info and scores on LeaderBoard
const URL = backend + "players";
fetch(URL)
  .then((res) => res.json())
  .then((users) => displayResults(users))
  .catch((err) => console.log(err));

function displayResults(users) {
  document.getElementById("list").innerHTML = "";
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const { playerName, days, currentAmount } = user;
    const displayCard = `
    <div class="item">
      <div class="rank">1</div>
      <div class="name">${playerName}</div>
      <div class="days">${days}</div>
      <div class="score">${currentAmount}</div>
    </div>
    `;

    document.getElementById("list").innerHTML += displayCard;
  }
}

// Header font
const target = window.document.getElementsByTagName("h1")[0];

const flickerLetter = (letter) =>
  `<span style="animation: text-flicker-in-glow ${
    Math.random() * 4
  }s linear both ">${letter}</span>`;
const colorLetter = (letter) =>
  `<span style="color: hsla(${
    Math.random() * 360
  }, 100%, 80%, 1);">${letter}</span>`;
const flickerAndColorText = (text) =>
  text.split("").map(flickerLetter).map(colorLetter).join("");
const neonGlory = (target) =>
  (target.innerHTML = flickerAndColorText(target.textContent));

neonGlory(target);
target.onclick = ({ target }) => neonGlory(target);
