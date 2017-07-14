export const toFullName = (person: { lastName: string, firstName: string, middleName: string }) => {
  return [ person.lastName, person.firstName, person.middleName ]
    .filter(Boolean).join(' ');
};

export const timeToHourMinSec = (str: string): { hour: number; minute: number; second: number; } => {
  // const validate = obj => {};
  const [ hour, minute, second ] = str.split(':').map(Number);
  return { hour, minute, second };
};
