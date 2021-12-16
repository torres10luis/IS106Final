import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlexModalService } from '../shared-components/flex-modal/flex-modal.service';
import { Http } from '@angular/http';

interface IOrder {
  pid: string;
  image: string;
  description: string;
  quantity: number;
  price: number;
}
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit {

  orders: Array<IOrder> = [];
  name = '';
  errorMessage = '';
  confirmMessage = '';
  constructor(
    private router: Router,
    private flexModal: FlexModalService,
    private http: Http
  ) {

  }

  async ngOnInit() {
    this.loadDefaultOrders();
  }


  calculate() {
    const total = this.orders.reduce((inc, item, i, arr) => {
      inc += item.price * item.quantity;
      return inc;
    }, 0);
    const taxAmount = total * .1;

    const subTotal = total - taxAmount;
    console.log('from calculate() total: ', total, 'taxAmount', taxAmount, 'subTotal', subTotal);
    return {
      total: total,
      taxAmount: taxAmount,
      subTotal: subTotal
    };
  }

  submit() {
    const commaIndex = this.name.indexOf(', ');
    let error = false;
    if (this.name === '') {
      this.errorMessage = 'First Name, Last Name must be defined!';
      error = true;
    } else if (commaIndex === -1) {
      this.errorMessage = 'Name must have a comma and a space in the name!';
      error = true;
    }

    if (!error) {
      const firstName = this.name.slice(commaIndex + 1, this.name.length);
      const lastName = this.name.slice(0, commaIndex);
      const fullName = firstName + ' ' + lastName;
      const calculation = this.calculate();
      this.confirmMessage = `Thank you for your order ${fullName} Your sub total is:
      ${calculation.subTotal}. Your tax amount is ${calculation.taxAmount}. Your grand total is ${calculation.total}`;
      this.flexModal.openDialog('confirm-modal');
    } else {
      this.flexModal.openDialog('error-modal');
    }
  }
  loadDefaultOrders() {
    this.orders = [{
      'pid': '1',
      'image': 'assets/sm_hotdog.jpeg',
      'description': 'Hot Dog',
      'price': 5.00,
      'quantity': 2
    }, {
      'pid': '2',
      'image': 'assets/sm_hamberger.jpeg',
      'description': 'Hamberger',
      'price': 6.00,
      'quantity': 1
    }, {
      'pid': '3',
      'image': 'assets/sm_pizza.jpeg',
      'description': 'Large Pizza',
      'price': 12.00,
      'quantity': 2
    }];
  }

  delete(index: number) {
    this.orders.splice(index, 1);
  }

  addItem(item: string) {

    if (item === 'hot dog') {
      this.orders.unshift({
        'pid': '1',
        'image': 'assets/sm_hotdog.jpeg',
        'description': 'Hot Dog',
        'price': 5.00,
        'quantity': 0
      });
    } else if (item === 'hamberger') {
      this.orders.unshift({
        'pid': '2',
        'image': 'assets/sm_hamberger.jpeg',
        'description': 'Hamberger',
        'price': 6.00,
        'quantity': 0
      });
    } else if (item === 'pizza') {
      this.orders.unshift({
        'pid': '3',
        'image': 'assets/sm_pizza.jpeg',
        'description': 'Large Pizza',
        'price': 12.00,
        'quantity': 0
      });
    }

  }

  clear() {
    this.orders = [];
  }
}
