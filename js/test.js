// импортируем массив с вопросами
import { questions } from "./questions.js";
//импортируем функцию получения случайного числа.
import { getRandomInt } from "./utils/util.js";

// Копируем вопросы в рабочий массив
let questionsArr = [...questions];

// доступ к кнопкам:
// начать_тестирование
const startTestingBtn = document.getElementById("start_testing");
// следующий вопрос
const nextQuestionBtn = document.getElementById("next_question");
// окончить тестирование
const endTestBtn = document.getElementById("end_test");
// рестарт теста
const restartTest = document.getElementById("restart_test");

//доступ к блоку с вопросами теста
const testBlock = document.querySelector(".test_block");
//доступ к блоку с вопросом теста
const questionText = document.getElementById("question_text");
//доступ к input с ответом
const answerOnQuestion = document.getElementById("answer_on_question");

//доступ к блоку с результатом
const resultBlock = document.querySelector(".result_block");
//количество вопросов
const answerQuantity = document.getElementById("answer_quantity");
//количество правильных ответов
const answerRight = document.getElementById("answer_right");
//количество неправильных ответов
const answerWrong = document.getElementById("answer_wrong");
//детали неверных ответов
const detailsWrong = document.querySelector(".details_wrong");
const detailsRight = document.querySelector(".details_right");
const detailsWrongTable = document.getElementById("details_wrong_table");
const detailsRightTable = document.getElementById("details_right_table");

// Доступ к попАп
const popUp = document.getElementById("popup_bg");
// доступ к попАп кнопке
const popUpBtn = document.getElementById("popup_btn");

let randomQuestion; // переменная в которой будет храниться рандомный вопрос.
let answerArr = []; // массив для хранения ответов.

// добавляем слушатель к кнопке начало_тестирования
startTestingBtn.addEventListener("click", startTesting);
// добавляем слушатель к копке попАп для закрытия окна попАп
popUpBtn.addEventListener("click", function () {
  popUp.style.top = "-200vh";
  answerOnQuestion.value = "";
  answerOnQuestion.addEventListener("change", nextQuestion);
  answerOnQuestion.focus();
});

// вешаем слушатели на кнопки
nextQuestionBtn.addEventListener("click", nextQuestion);
endTestBtn.addEventListener("click", testOff);
restartTest.addEventListener("click", restartTesting);

// вешаем слушатели на input с ответом на вопрос
answerOnQuestion.addEventListener("input", testAnswer);
answerOnQuestion.addEventListener("keydown", (e) => {
	console.log(e.key)
  if (e.key == "Enter") {
    nextQuestion();
  }
});

// функция начала тестирования
function startTesting() {
  console.log("start");
  testBlock.style.display = "block";
  startTestingBtn.style.display = "none";

  getQuestion();
}

//функция выведения рандомного вопроса
function getQuestion() {
  let maxIndexNumber = questionsArr.length - 1;
  if (maxIndexNumber > -1) {
    let randomNum = getRandomInt(0, maxIndexNumber);
    randomQuestion = questionsArr.splice(randomNum, 1)[0];
    questionText.textContent = randomQuestion.text;
    nextQuestionBtn.disabled = true;
    answerOnQuestion.focus();
  } else {
    testOff();
  }
}

//функция тестирования inputa с ответом
function testAnswer() {
  let answer = answerOnQuestion.value;

  let testOnNum = /\d+|[а-я]+/.test(answer);
  if (testOnNum) {
    nextQuestionBtn.disabled = true;
    popUp.style.top = "0vh";
    answerOnQuestion.removeEventListener("change", nextQuestion);
    popUpBtn.focus();
  } else {
    answer.length == 0
      ? (nextQuestionBtn.disabled = true)
      : (nextQuestionBtn.disabled = false);
  }
}

// функция следующего вопроса
function nextQuestion() {
  console.log("next question");
  let question = randomQuestion.text;
  let questionAnswer = randomQuestion.answer;
  answerArr.push({
    text: question,
    rightAnswer: questionAnswer,
    userAnswer: [answerOnQuestion.value],
    isRight: answerOnQuestion.value == questionAnswer,
  });
  if (answerOnQuestion.value == questionAnswer) {
    questionText.classList.add("right_answer_on_question");
  } else {
    questionText.classList.add("wrong_answer_on_question");
  }
  // answerOnQuestion.addEventListener('change', nextQuestion);
  setTimeout(() => {
    answerOnQuestion.value = "";
    questionText.classList.remove("wrong_answer_on_question");
    questionText.classList.remove("right_answer_on_question");
    getQuestion();
  }, 200);
}

// функция окончания тестирования и выведения результатов
function testOff() {
  testBlock.style.display = "none";

  let testAnswerQuantity = answerArr.length;
  let testRightAnswerQuantity = answerArr.filter(
    (e) => e.isRight == true
  ).length;
  let testWrongAnswerQuantity = answerArr.filter(
    (e) => e.isRight == false
  ).length;
  answerQuantity.textContent = testAnswerQuantity;
  answerRight.textContent = testRightAnswerQuantity;
  answerWrong.textContent = testWrongAnswerQuantity;
  setDetails();
  resultBlock.style.display = "block";
}

//функция перезапуска теста
function restartTesting() {
  questionsArr = [...questions];
  answerArr = [];
  resultBlock.style.display = "none"; // прячем блок с результатами теста
  // прячем details
  detailsRight.style.display = "none";
  detailsWrong.style.display = "none";
  // убираем арибут открытия в details
  detailsRight.removeAttribute("open");
  detailsWrong.removeAttribute("open");
  //получаем доствп к ответам и удаляем их.
  try {
    let goodAnswer = document.querySelector(".good");
    detailsRightTable.removeChild(goodAnswer);
  } catch {}
  try {
    let badAnswer = document.querySelector(".bad");
    detailsWrongTable.removeChild(badAnswer);
  } catch {}
  // перезапускаем тест
  startTesting();
}

// заплнение тега detail таблицей с подробным результатом
function setDetails() {
  let wrong = createTrInTable("wrong");
  if (wrong.children.length > 0) {
    detailsWrongTable.appendChild(wrong);
    detailsWrong.style.display = "block";
  }
  let right = createTrInTable();
  if (right.children.length > 0) {
    detailsRightTable.appendChild(right);
    detailsRight.style.display = "block";
  }
}

// функция для создания таблицы с подробными результатами ответов
function createTrInTable(flag) {
  let answerArrForTable = [];
  let tBody = document.createElement("tbody");

  if (flag == "wrong") {
    tBody.classList.add("bad");
    answerArrForTable = answerArr.filter((e) => e.isRight == false);
  } else {
    tBody.classList.add("good");
    answerArrForTable = answerArr.filter((e) => e.isRight == true);
  }
  for (let elem of answerArrForTable) {
    let tr = document.createElement("tr");
    let td_question = document.createElement("td");
    let td_userAnswer = document.createElement("td");
    td_question.innerHTML = elem.text;
    td_userAnswer.innerHTML = elem.userAnswer;
    tr.appendChild(td_question);
    tr.appendChild(td_userAnswer);
    tBody.appendChild(tr);
  }

  return tBody;
}
