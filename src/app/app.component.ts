import { Component, OnDestroy, OnInit } from '@angular/core';
import { TestClass } from './test-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public total = 0;
  public loading = false;

  private worker: Worker | undefined;
  private readonly numberOfIterations = 30000000;
  private readonly oneDayInMilliseconds = 8.64e+7;

  ngOnInit(): void {
    this.worker = new Worker(new URL('./calculation.worker', import.meta.url));
    this.worker.onmessage = (ev: MessageEvent<number>) => {
      this.total = ev.data;
      this.loading = false;
    };
  }

  ngOnDestroy(): void {
    this.worker?.terminate();
  }

  public runInMainThread(): void {
    this.loading = true;
    let total = 0;
    for (let index = 0; index < this.numberOfIterations; index++) {
      const today = Date.now();
      const nextDate = ((index + 1) * this.oneDayInMilliseconds) + today;
      const numberToAdd = (nextDate - today) / this.oneDayInMilliseconds;
      total += numberToAdd;
    }

    this.total = total;
    this.loading = false;
  }

  public async runInMainThreadAsync(): Promise<void> {
    // Attempt by using 1 promise that calculates all iterations
    await new Promise<void>(resolve => {
      this.loading = true;
      let total = 0;
      for (let index = 0; index < this.numberOfIterations + 10; index++) {
        const today = Date.now();
        const nextDate = ((index + 1) * this.oneDayInMilliseconds) + today;
        const numberToAdd = (nextDate - today) / this.oneDayInMilliseconds;
        total += numberToAdd;
      }

      this.total = total;
      this.loading = false;
      resolve();
    });

    // Attempt by using a single promise for each iteration (NOT RECOMMENDED 🤯💣)
    // this.loading = true;
    // const calculationsAsIndividualPromises = [...Array(this.numberOfIterations).keys()].map(index => calculateNumberToAdd(index + 1));
    // const calculationResults = await Promise.all(calculationsAsIndividualPromises);
    // const sum = calculationResults.reduce((accumulator, current) => accumulator + current, 0);
    // this.total = sum;
    // this.loading = false;

    // function calculateNumberToAdd(index: number): Promise<number> {
    //   const oneDayInMilliseconds = 8.64e+7;
    //   return new Promise<number>(resolve => {
    //     const today = Date.now();
    //     const nextDate = ((index + 1) * this.oneDayInMilliseconds) + today;
    //     const numberToAdd = (nextDate - today) / this.oneDayInMilliseconds;

    //     resolve(numberToAdd);
    //   });
    // }
  }

  public runInWorkerThread(): void {
    this.loading = true;
    this.worker?.postMessage(this.numberOfIterations + 20);
  }
}
