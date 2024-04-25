class Level {
  private static range: number = 11;
  private static instance: Level;
  private constructor() {}
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new Level();
    return this.instance;
  }
  static setLevel(level: number) {
    this.range = level;
  }
  static getRange() {
    return this.range;
  }
}
class Task {
  private num1: number;
  private num2: number;
  constructor() {
    this.num1 = Math.floor(Math.random() * Level.getRange()) + 3;
    this.num2 = Math.floor(Math.random() * Level.getRange()) + 3;
  }
  get newTask() {
    return [this.num1, this.num2, this.num1 * this.num2];
  }
}

class App {
  private field1: HTMLSpanElement;
  private field2: HTMLSpanElement;
  private inputField: HTMLInputElement;
  private form: HTMLFormElement;
  private statsInfoHard: HTMLDivElement;
  private statsInfoEasy: HTMLDivElement;
  private levelElement: HTMLElement;
  // private multiplicationEL: HTMLSpanElement;
  // private divisionEL: HTMLSpanElement;
  private operatorEL: HTMLSpanElement;
  private operationWrapperEL: HTMLDialogElement;
  num1 = 0;
  num2 = 0;
  private result = 0;
  private correctResultsHard = 0;
  private correctResultsEasy = 0;
  level: any;
  private operation: boolean = true;
  private formActive: boolean = true;

  constructor() {
    this.field1 = document.querySelector('.first-number')!;
    this.field2 = document.querySelector('.second-number')!;
    this.inputField = document.querySelector('.result')!;
    this.form = document.querySelector('form')!;
    this.statsInfoHard = document.querySelector('.stats-info--hard')!;
    this.statsInfoEasy = document.querySelector('.stats-info--easy')!;
    this.levelElement = document.querySelector('.level-wrapper')!;
    this.operatorEL = document.querySelector('.operator')!;
    this.operationWrapperEL = document.querySelector('.operation')!;

    this.correctResultsHard = this.getStats()[1] ?? 0;

    this.correctResultsEasy = this.getStats()[2] ?? 0;
    this.renderStats();
    this.renderTask(new Task().newTask);
    this.listenForResults();
    this.safeStats();

    this.level = Level.getInstance();
    this.levelListener();
    this.operationListener();
  }

  renderTask(args: number[]) {
    this.inputField.value = '';
    const [number1, number2, result] = args;
    if (this.operation) {
      this.operatorEL.textContent = '×';
      this.num1 = number1;
      this.num2 = number2;
      this.result = result;
      this.field1.textContent = this.num1 + '';
      this.field2.textContent = this.num2 + '';
      this.inputField.focus();
      return;
    }
    if (!this.operation) {
      this.operatorEL.textContent = ':';
      this.num1 = number1;
      this.num2 = result;
      this.result = number2;
      this.field1.textContent = this.num2 + '';
      this.field2.textContent = this.num1 + '';
      this.inputField.focus();
      return;
    }
  }
  listenForResults() {
    this.form.addEventListener('submit', this.manageTask.bind(this));
  }
  manageTask(e: Event) {
    e.preventDefault();
    if (!this.formActive) return;
    const userValue = this.inputField.value;
    if (userValue === '') return;
    if (+userValue === this.result) this.manageUX(true);
    if (+userValue !== this.result) this.manageUX(false);
  }
  manageUX(result: boolean) {
    const resClass = result ? 'result-right' : 'result-wrong';
    this.inputField.classList.add(resClass);
    const resultReact: Promise<any> = new Promise((resolve, _) => {
      this.formActive = false;
      setTimeout(() => (this.inputField.value = this.result + ''), 1000);

      if (result) {
        if (Level.getRange() === 11) this.correctResultsHard += 1;
        else this.correctResultsEasy += 1;
        this.safeStats();
        this.renderStats();
        setTimeout(() => {
          this.inputField.classList.remove(resClass);
          this.formActive = true;
          resolve('');
        }, 3000);
      } else {
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
    const data = JSON.parse(localStorage.getItem('mathdata')!);
    if (!data || data.data[0] !== this.getToday()) return 0;
    else return data.data;
  }

  renderStats() {
    this.statsInfoHard.textContent = this.correctResultsHard + ' ⭐⭐⭐';
    this.statsInfoEasy.textContent = this.correctResultsEasy + ' ⭐';
  }

  levelListener() {
    this.levelElement.addEventListener('click', this.levelManage.bind(this));
  }
  levelManage(e: Event) {
    const element = e.target as HTMLElement;
    if (!element.closest('.icon')) return;
    this.levelElement
      .querySelectorAll('.icon')
      .forEach(e => e.classList.remove('level-active'));

    element.closest('.icon')!.classList.add('level-active');
    element.closest('.hard') ? Level.setLevel(11) : Level.setLevel(7);
    this.renderTask(new Task().newTask);
  }
  operationListener() {
    this.operationWrapperEL.addEventListener(
      'click',
      this.operationManage.bind(this)
    );
  }
  operationManage(e: Event) {
    e.preventDefault();
    const element = e.target as HTMLElement;
    if (!element.closest('.operation-btn')) return;
    this.operationWrapperEL
      .querySelectorAll('.operation-btn')
      .forEach(el => el.classList.remove('operation-active'));
    element.classList.add('operation-active');
    this.operation ? (this.operation = false) : (this.operation = true);
    this.renderTask(new Task().newTask);
  }
}

new App();
