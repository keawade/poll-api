interface IUser {
  _id?: string;
  displayname: string;
  password: string;
  username: string;
}

interface IPoll {
  _id?: string;
  options: string[];
  owner: string;
  question: string;
  responses: IPollResponse[];
  visibility: 'private' | 'public';
}

interface IPollResponse {
  _id?: string;
  user: string;
  response: string;
}
