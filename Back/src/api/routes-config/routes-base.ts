import { Router } from "express";
import { IAppContext } from "../../contexts/shared/domain/app-context/app-context.interface";

type TConstructor<T> = { new (context: IAppContext): T };

export class RouterBase<T> {
  public router: Router;
  protected controller: T;
  constructor(TController: TConstructor<T>, context: IAppContext) {
    this.router = Router();
    this.controller = new TController(context);
    this.routes();
  }

  routes(): void {}
}
