// импортируем массив с вопросами
import { questions } from './questions.js';
//импортируем функцию получения случайного числа.
import { getRandomInt } from './utils/util.js';

let questionsArr = [...questions];


// доступ к кнопкам:
// начать_тестирование
const startTestingBtn = document.getElementById('start_testing');
// следующий вопрос
const nextQuestionBtn = document.getElementById('next_question');
// окончить тестирование
const endTestBtn = document.getElementById('end_test');
// рестарт теста
const restartTest = document.getElementById('restart_test')



//доступ к блоку с вопросами теста
const testBlock = document.querySelector('.test_block');
//доступ к блоку с вопросом теста
const questionText = document.getElementById('question_text');
//доступ к input с ответом
const answerOnQuestion = document.getElementById('answer_on_question');

//доступ к блоку с результатом
const resultBlock = document.querySelector('.result_block');
//количество вопросов
const answerQuantity = document.getElementById('answer_quantity');
//количество правильных ответов
const answerRight = document.getElementById('answer_right');
//количество неправильных ответов
const answerWrong = document.getElementById('answer_wrong');


// Доступ к попАп
const popUp = document.getElementById('popup_bg');
// доступ к попАп кнопке
const popUpBtn = document.getElementById('popup_btn');


let randomQuestion; // переменная в которой будет храниться рандомный вопрос.
let answerArr = []; // массив для хранения ответов.


// добавляем слушатель к кнопке начало_тестирования
startTestingBtn.addEventListener('click', startTesting);
// добавляем слушатель к копке попАп для закрытия окна попАп
popUpBtn.addEventListener('click', function () {
	popUp.style.top = '-200vh';
	answerOnQuestion.value = '';
})

// вешаем слушатели на кнопки
nextQuestionBtn.addEventListener('click', nextQuestion)

endTestBtn.addEventListener('click', testOff);

restartTest.addEventListener('click', restartTesting)


function startTesting() {
	testBlock.style.display = 'block';
	startTestingBtn.style.display = 'none';

	getQuestion()
}

function getQuestion() {
	let maxNumber = questionsArr.length - 1;
	if(maxNumber > -1) {
		let randomNum = getRandomInt(0, maxNumber);
		randomQuestion = questionsArr.splice(randomNum, 1)[0];
		questionText.textContent = randomQuestion.text
	} else {
		testOff()
	}
}


answerOnQuestion.addEventListener('input', testAnswer)


function testAnswer() {
	let answer = answerOnQuestion.value;

	let testOnNum = /\d+|[а-я]+/.test(answer);
	if (testOnNum) {
		nextQuestionBtn.disabled = true;
		popUp.style.top = '0vh';
	} else {
		answer.length == 0
			? nextQuestionBtn.disabled = true
			: nextQuestionBtn.disabled = false;
	}
}

function nextQuestion() {
	let questionText = randomQuestion.text;
	let questionAnswer = randomQuestion.answer;
	answerArr.push({
		text: questionText,
		rightAnswer: questionAnswer,
		userAnswer: [answerOnQuestion.value],
		isRight: answerOnQuestion.value == questionAnswer
	})
	answerOnQuestion.value = ''
	console.log('answerArr', answerArr)
	getQuestion()
}

function testOff() {
	testBlock.style.display = 'none';
	
	let testAnswerQuantity = answerArr.length;
	let testRightAnswerQuantity = (answerArr.filter(e => e.isRight == true)).length;
	let testWrongAnswerQuantity = (answerArr.filter(e => e.isRight == false)).length;
	answerQuantity.textContent = testAnswerQuantity;
	answerRight.textContent = testRightAnswerQuantity;
	answerWrong.textContent = testWrongAnswerQuantity;
	resultBlock.style.display = 'block';
}

function restartTesting() {
	questionsArr = [...questions];
	answerArr = [];
	resultBlock.style.display = 'none';
	// testBlock.style.display = 'block';
	startTesting()
}