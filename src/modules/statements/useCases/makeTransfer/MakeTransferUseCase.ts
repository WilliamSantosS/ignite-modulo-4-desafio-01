import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { MakeTransferError } from "./MakeTransferError";


enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

interface IRequest {
  user_id: string,
  type: OperationType,
  amount: number,
  description: string,
  receiver_id: string,
  sender_id: string;
}

@injectable()
export class MakeTransferUseCase {
  constructor(
  @inject('UsersRepository')
  private usersRepository: IUsersRepository,

  @inject('StatementsRepository')
  private statementsRepository: IStatementsRepository)
  {}
  async execute({ user_id, type, amount, description, receiver_id, sender_id }: IRequest ) {
    const user = await this.usersRepository.findById(user_id);

    const receiverId = await this.usersRepository.findById(receiver_id);

    if(!user) {
      throw new MakeTransferError.UserNotFound();
    }

    if(!receiverId) {
      throw new MakeTransferError.ReceiverNotFound();
    }

    if(type === 'transfer') {
      const { balance } = await this.statementsRepository.getUserBalance({ user_id });

      if (balance < amount) {
        throw new MakeTransferError.InsufficientFunds()
      }
    }

    const statementOperation = await this.statementsRepository.create({
      user_id,
      type,
      amount,
      description,
      sender_id,
    });

    return statementOperation
  }
}


