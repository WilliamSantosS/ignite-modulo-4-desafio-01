import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { MakeTransferUseCase } from './MakeTransferUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

export class MakeTransferController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { amount, description } = request.body;
    const { receiver_id } = request.params;

    const splittedPath = request.originalUrl.split('/')
    const type = splittedPath[splittedPath.length - 2] as OperationType;

    const makeTransferUseCase = container.resolve(MakeTransferUseCase);

    const transfer = await makeTransferUseCase.execute({
      user_id,
      type,
      amount,
      description,
      receiver_id,
      sender_id: user_id
    })

    return response.status(201).json(transfer);
  }
}


