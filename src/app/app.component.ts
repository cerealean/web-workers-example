import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public total = 0;
  public loading = false;

  private worker!: Worker;

  constructor() {
  }

  ngOnInit(): void {
    this.worker = new Worker(new URL('./calculation.worker', import.meta.url));
    this.worker.onmessage = ({ data }) => {
      this.total = data;
      this.loading = false;
    };
  }

  ngOnDestroy(): void {
    this.worker.terminate();
  }

  public runInMainThread(): void {
    this.loading = true;
    const oneDayInMilliseconds = 8.64e+7;
    let total = 0;
    for (let index = 0; index < 20000000; index++) {
      const today = Date.now();
      const nextDate = ((index + 1) * oneDayInMilliseconds) + today;
      const numberToAdd = (nextDate - today) / oneDayInMilliseconds;
      total += numberToAdd;
    }

    this.total = total;
    this.loading = false;
  }

  public async runInMainThreadAsync(): Promise<void> {
    // Attempt by using 1 promise that calculates all 20 million
    await new Promise<void>(resolve => {
      this.loading = true;
      const oneDayInMilliseconds = 8.64e+7;
      let total = 0;
      for (let index = 0; index < 20000000; index++) {
        const today = Date.now();
        const nextDate = ((index + 1) * oneDayInMilliseconds) + today;
        const numberToAdd = (nextDate - today) / oneDayInMilliseconds;
        total += numberToAdd;
      }

      this.total = total;
      this.loading = false;
      resolve();
    });

    // Attempt by using 20 million promises (NOT RECOMMENDED 🤯💣)
    // this.loading = true;
    // const calculationsAsIndividualPromises = [...Array(20000000).keys()].map(index => calculateNumberToAdd(index + 1));
    // const calculationResults = await Promise.all(calculationsAsIndividualPromises);
    // const sum = calculationResults.reduce((accumulator, current) => accumulator + current, 0);
    // this.total = sum;
    // this.loading = false;

    // function calculateNumberToAdd(index: number): Promise<number> {
    //   const oneDayInMilliseconds = 8.64e+7;
    //   return new Promise<number>(resolve => {
    //     const today = Date.now();
    //     const nextDate = ((index + 1) * oneDayInMilliseconds) + today;
    //     const numberToAdd = (nextDate - today) / oneDayInMilliseconds;

    //     resolve(numberToAdd);
    //   });
    // }
  }

  public runInWorkerThread(): void {
    this.loading = true;
    this.worker.postMessage('');
  }
}
