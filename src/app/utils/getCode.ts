import * as moment from 'moment';

export const generateRandomString = (num: number) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result1 =
    Math.random().toString(16).substring(0, num) +
    moment().format('DDMMYYYYhmm');

  return result1;
};
