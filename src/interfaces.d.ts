interface IUser {
  _id?: string;
  displayname: string;
  password: string;
  username: string;
}

interface IPoll {
  _id?: string;
  responseOptions: string[];
  owner: string;
  question: string;
  responses: IPollResponse[];
  visibility: 'private' | 'public';
}

interface IPollResponse {
  username: string;
  response: string;
}
