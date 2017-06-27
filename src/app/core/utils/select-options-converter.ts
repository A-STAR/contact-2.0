import { NamedValue, SelectOption } from './select-options-converter.interface';

export const namedValuesToSelectOptions = (values: Array<NamedValue>): Array<SelectOption> => values.map(value => ({
  label: value.name,
  value: value.id
}));
