"use strict";
class Level {
    constructor() { }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new Level();
        return this.instance;
    }
    static setLevel(level) {
        this.range = level;
    }
    static getRange() {
        return this.range;
    }
}
Level.range = 11;
class Task {
    constructor() {
        this.num1 = Math.floor(Math.random() * Level.getRange()) + 3;
        this.num2 = Math.floor(Math.random() * Level.getRange()) + 3;
    }
    get newTask() {
        return [this.num1, this.num2, this.num1 * this.num2];
    }
}
class App {
    constructor() {
        var _a, _b;
        this.num1 = 0;
        this.num2 = 0;
        this.result = 0;
        this.correctResultsHard = 0;
        this.correctResultsEasy = 0;
        this.formActive = true;
        this.field1 = document.querySelector('.first-number');
        this.field2 = document.querySelector('.second-number');
        this.inputField = document.querySelector('.result');
        this.form = document.querySelector('form');
        this.statsInfoHard = document.querySelector('.stats-info--hard');
        this.statsInfoEasy = document.querySelector('.stats-info--easy');
        this.levelElement = document.querySelector('.level');
        this.correctResultsHard = (_a = this.getStats()[1]) !== null && _a !== void 0 ? _a : 0;
        this.correctResultsEasy = (_b = this.getStats()[2]) !== null && _b !== void 0 ? _b : 0;
        this.renderStats();
        this.renderTask(new Task().newTask);
        this.listenForResults();
        this.safeStats();
        this.level = Level.getInstance();
        this.levelListener();
    }
    renderTask(args) {
        this.inputField.value = '';
        const [number1, number2, result] = args;
        this.field1.textContent = number1 + '';
        this.field2.textContent = number2 + '';
        this.num1 = number1;
        this.num2 = number2;
        this.result = result;
        this.inputField.focus();
    }
    listenForResults() {
        this.form.addEventListener('submit', this.manageTask.bind(this));
    }
    manageTask(e) {
        e.preventDefault();
        if (!this.formActive)
            return;
        const userValue = this.inputField.value;
        if (userValue === '')
            alert('Wprowadź wynik');
        if (+userValue === this.result)
            this.manageUX(true);
        if (+userValue !== this.result)
            this.manageUX(false);
    }
    manageUX(result) {
        const resClass = result ? 'result-right' : 'result-wrong';
        this.inputField.classList.add(resClass);
        const resultReact = new Promise((resolve, _) => {
            this.formActive = false;
            setTimeout(() => (this.inputField.value = this.result + ''), 1000);
            if (result) {
                if (Level.getRange() === 11)
                    this.correctResultsHard += 1;
                else
                    this.correctResultsEasy += 1;
                this.safeStats();
                this.renderStats();
                setTimeout(() => {
                    this.inputField.classList.remove(resClass);
                    this.formActive = true;
                    resolve('');
                }, 3000);
            }
            else {
                setTimeout(() => {
                    this.inputField.classList.remove(resClass);
                    resolve('');
                    this.formActive = true;
                }, 3000);
            }
        });
        resultReact.then(() => this.renderTask(new Task().newTask));
    }
    getToday() {
        const today = new Date();
        const date = `${today.getFullYear()}.${today.getMonth()}.${today.getDate()}`;
        return date + '';
    }
    safeStats() {
        const date = this.getToday();
        const safedObj = JSON.stringify({
            data: [date, this.correctResultsHard, this.correctResultsEasy],
        });
        localStorage.setItem('mathdata', safedObj);
    }
    getStats() {
        const data = JSON.parse(localStorage.getItem('mathdata'));
        if (!data || data.data[0] !== this.getToday())
            return 0;
        else
            return data.data;
    }
    renderStats() {
        this.statsInfoHard.textContent = this.correctResultsHard + ' ⭐⭐⭐';
        this.statsInfoEasy.textContent = this.correctResultsEasy + ' ⭐';
    }
    levelListener() {
        this.levelElement.addEventListener('click', this.levelManage.bind(this));
    }
    levelManage(e) {
        const element = e.target;
        if (!element.closest('.icon'))
            return;
        this.levelElement
            .querySelectorAll('.icon')
            .forEach(e => e.classList.remove('level-active'));
        element.classList.add('level-active');
        element.closest('.hard') ? Level.setLevel(11) : Level.setLevel(7);
        this.renderTask(new Task().newTask);
    }
}
new App();
//# sourceMappingURL=app.js.map