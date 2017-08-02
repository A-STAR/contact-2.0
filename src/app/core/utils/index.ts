/**
 * General purpose utility library
 * Description: exports small utility functions to be used across different components
 */


export const toFullName = (person: { lastName: string, firstName: string, middleName: string }) => {
  return [ person.lastName, person.firstName, person.middleName ]
    .filter(Boolean).join(' ');
};

export const timeToHourMinSec = (str: string): { hour: number; minute: number; second: number; } => {
  // const validate = obj => {};
  const [ hour, minute, second ] = str.split(':').map(Number);
  return { hour, minute, second };
};

export const arrayToObject = (key: string) => (arr: Array<any>) => {
  return arr.reduce((acc, item) => {
    acc[item[key]] = item;
    return acc;
  }, {});
};

export const isClosedRenderer = (term: any) => term.isClosed ? `<i class="fa fa-check-square-o" aria-hidden="true"></i>` : '';
