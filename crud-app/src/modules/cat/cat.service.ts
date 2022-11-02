import { Injectable } from '@nestjs/common';
import * as cuid from 'cuid';
import { Cat } from './entities/cat.entity';
import { ICreateCat } from './interfaces/create-cat.interface';
import { IUpdateCat } from './interfaces/update-cat.interface';

@Injectable()
export class CatService {
  private cats: Array<Cat> = [];

  create(cat: ICreateCat) {
    const newCat = {
      id: cuid(),
      ...cat,
    };

    this.cats.push(newCat);
  }

  findAll(): Array<Cat> {
    return this.cats;
  }

  findOne(catId: string): Cat {
    const cat = this.cats.find((cat) => cat.id === catId);

    return cat;
  }

  update(catId: string, cat: IUpdateCat) {
    const catIndex = this.cats.findIndex((cat) => cat.id === catId);

    if (catIndex === -1) return null;

    this.cats[catIndex] = {
      ...this.cats[catIndex],
      ...cat,
    };
  }

  deleteOne(catId: string) {
    this.cats = this.cats.filter((cat) => cat.id !== catId);
  }
}
