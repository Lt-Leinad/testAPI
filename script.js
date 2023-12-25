let PROJECT_ID = "h7eiwyqc";
let DATASET = "production";
let QUERY = encodeURIComponent('*[_type == "post"]');
let MyURL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`;

// fetch the content
fetch(MyURL)
  .then((res) => res.json())
  .then((response) => {
    let obj = response.result[0].body[0].children[0].text;
    let data = JSON.parse(obj);

    let randomIndex = (n) => Math.floor(Math.random() * (n + 1));

    const colorsReset = () => {
      document.querySelector(".correct").classList.remove("fade-in");
      document.querySelector(".wrong").classList.remove("fade-in");
      document.querySelector(".wrong").classList.add("fade-out");
      document.querySelector(".correct").classList.add("fade-out");
      setTimeout(() => {
        document.querySelector(".wrong").classList.add("display-none");
        document.querySelector(".correct").classList.add("display-none");
        document.querySelector(".wrong").classList.remove("fade-out");
        document.querySelector(".correct").classList.remove("fade-out");
      }, 1000);
    };

    let answer;
    let points = 0;
    let prevAnswers = [];

    const questionReset = () => {
      let dataArr = data.filter((x) => x.flags.png);
      prevAnswers.forEach((x) => dataArr.splice(dataArr.indexOf(x), 1));
      let answerIndex = randomIndex(dataArr.length - 1);
      answer = dataArr[answerIndex];
      dataArr.splice(answerIndex, 1);
      if (dataArr.length > 3) {
        let answers = [0, 0, 0, 0];
        answers[randomIndex(3)] = answer.name.common;
        let falseAnswerArr = dataArr.slice();
        let falseAnswers = [];
        while (falseAnswers.length < 4) {
          let falseAnswerIndex = randomIndex(falseAnswerArr.length - 1);
          falseAnswers.push(falseAnswerArr[falseAnswerIndex].name.common);
          falseAnswerArr.splice(falseAnswerIndex, 1);
        }

        answers = answers.map((x, i) =>
          x == 0 ? (x = falseAnswers[i]) : (x = x)
        );

        document.querySelector(".flag").src = answer.flags.png;
        [...document.querySelectorAll(".answer")].forEach(
          (x, i) => (x.textContent = answers[i])
        );
      } else {
        alert("Restart");
        gameRestart();
      }
    };

    const gameInit = () => {
      document.querySelector(".points").textContent = points;
      questionReset();
      colorsReset();
    };

    const correct = function () {
      document.querySelector(".ding").play();
      document.querySelector(".correct").classList.remove("display-none");
      document.querySelector(".correct").classList.add("fade-in");
    };

    const wrong = function () {
      document.querySelector(".wrong").classList.remove("display-none");
      document.querySelector(".wrong").classList.add("fade-in");
      document.querySelector(".wrong").textContent = answer.name.common;
    };

    const pointsFunc = function (e) {
      prevAnswers.push(answer.name.common);
      if (answer.name.common == e.target.textContent) {
        points += 1;
        document.querySelector(".points").textContent = points;
        correct();
        gameInit();
      } else {
        points = 0;
        document.querySelector(".points").textContent = points;
        wrong();
        gameInit();
      }
    };

    gameInit();

    document.querySelector(".answer-a").addEventListener("click", pointsFunc);
    document.querySelector(".answer-b").addEventListener("click", pointsFunc);
    document.querySelector(".answer-c").addEventListener("click", pointsFunc);
    document.querySelector(".answer-d").addEventListener("click", pointsFunc);

    const gameRestart = function () {
      answer;
      points = 0;
      prevAnswers = [];
      gameInit();
    };
  })
  .catch((err) => console.error(err));
