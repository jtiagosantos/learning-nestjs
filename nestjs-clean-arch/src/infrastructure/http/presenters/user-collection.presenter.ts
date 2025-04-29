import { CollectionPresenter } from '@/@core/presenters/colletion.presenter';
import { UserPresenter } from './user.presenter';
import { ListUsersOutput } from '@/application/outputs/list-users.output';

export class UserCollectionPresenter extends CollectionPresenter {
  data: UserPresenter[];

  constructor(output: ListUsersOutput) {
    const { data, ...paginationProps } = output;

    super(paginationProps);

    this.data = data.map(user => new UserPresenter(user));
  }
}
