const prices = [
  {
    city: "Honolulu",
    prices: {
      pineapple: random(5, 10),
      apples: random(10, 20),
      cherries: random(20, 40),
      strawberries: random(15, 60),
      keyLimes: random(30, 80),
      avacadoes: random(50, 100),
    },
  },
  {
    city: "Seattle",
    prices: {
      pineapple: random(10, 20),
      apples: random(5, 15),
      cherries: random(10, 20),
      strawberries: random(10, 40),
      keyLimes: random(20, 80),
      avacadoes: random(60, 150),
    },
  },
  {
    city: "New York",
    prices: {
      pineapple: random(5, 25),
      apples: random(5, 15),
      cherries: random(20, 50),
      strawberries: random(20, 50),
      keyLimes: random(25, 75),
      avacadoes: random(60, 150),
    },
  },
  {
    city: "Los Angeles",
    prices: {
      pineapple: random(15, 25),
      apples: random(15, 30),
      cherries: random(15, 50),
      strawberries: random(10, 35),
      keyLimes: random(20, 50),
      avacadoes: random(10, 50),
    },
  },
  {
    city: "Miami",
    prices: {
      pineapple: random(5, 15),
      apples: random(20, 45),
      cherries: random(30, 50),
      strawberries: random(25, 55),
      keyLimes: random(15, 35),
      avacadoes: random(25, 100),
    },
  },
  {
    city: "Denver",
    prices: {
      pineapple: random(15, 35),
      apples: random(20, 50),
      cherries: random(35, 75),
      strawberries: random(5, 15),
      keyLimes: random(30, 50),
      avacadoes: random(50, 100),
    },
  },
];

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

//export
module.exports = prices;
