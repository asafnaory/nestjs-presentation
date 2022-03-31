import { Observer } from "./interfaces/Observer";
import { Stock } from "./stock";

export class StatusBar implements Observer {
  name = "StatusBar";
  private stocks: Stock[] = [];

  addStock(stock: Stock): void {
    this.stocks.push(stock);
    stock.addObserver(this);
  }

  removeStock(stock: Stock) {
    const stockIdx = this.stocks.findIndex(
      (subscribedStock) => subscribedStock.symbol === stock.symbol
    );
    this.stocks[stockIdx].removeObserver(this);
    this.stocks.splice(stockIdx, 1);
  }

  show() {
    console.log("StatusBar: Stocks: ");
    this.stocks.forEach((stock) => console.log(stock.printStock()));
  }

  update(stock: Stock): void {
    console.log(
      `${this.name}: Stock with symbol ${stock.symbol} price has changed to ${stock.price}`
    );
  }
}
