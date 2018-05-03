import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';
import { IFormula, IFormulaParams, IFormulaResult } from './formulas.interface';
import { IScriptEditorDefs, IScriptEditorSnippet } from '@app/shared/components/form/script-editor/script-editor.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { of } from 'rxjs/observable/of';

@Injectable()
export class FormulasService extends AbstractActionService {
  static MESSAGE_FORMULA_SAVED = 'MESSAGE_FORMULA_SAVED';

  private baseUrl = '/formula';

  constructor(
    protected actions: Actions,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    protected store: Store<IAppState>,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('FORMULA_VIEW');
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('FORMULA_EDIT');
  }

  get canCalculate$(): Observable<boolean> {
    return this.userPermissionsService.has('FORMULA_CALCULATE');
  }

  get formulaSnippets(): IScriptEditorSnippet[] {
    return [{
      name: 'if',
      tabTrigger: 'if',
      content: 'if (${1:true}) {\n${0}\n}\n'
    }, {
      name: 'if ... else',
      tabTrigger: 'if',
      content: 'if (${1:true}) {\n${2}\n} else {\n${0}\n}\n'
    }, {
      name: 'switch',
      tabTrigger: 'switch',
      content: 'switch (${1:expression}) {\ncase \'${3:case}\':\n${4:// code}\nbreak;\n${5}\ndefault:\n${2:// code}\n}\n'
    }, {
      name: 'case',
      tabTrigger: 'case',
      content: 'case \'${1:case}\':\n${2:// code}\nbreak;\n${3}\n'
    }, {
      name: 'for',
      tabTrigger: 'for',
      content: 'for (${1:i} = 0; $1 < ${2:limit}; $1++) {\n${3:$2[$1]}$0\n}\n'
    }];
  }

  fetchAll(): Observable<Array<IFormula>> {
    return this.dataService.readAll(this.baseUrl)
      .catch(this.notificationsService.fetchError().entity('entities.formulas.gen.plural').dispatchCallback());
  }

  fetch(formulaId: number): Observable<IFormula> {
    return this.dataService.read(`${this.baseUrl}/{formulaId}`, { formulaId })
      .catch(this.notificationsService.fetchError().entity('entities.formulas.gen.singular').dispatchCallback());
  }

  create(formula: IFormula): Observable<IFormula> {
    return this.dataService.create(this.baseUrl, {}, formula)
      .catch(this.notificationsService.createError().entity('entities.formulas.gen.singular').dispatchCallback());
  }

  update(formulaId: number, formula: IFormula): Observable<any> {
    return this.dataService.update(`${this.baseUrl}/{formulaId}`, { formulaId }, formula)
      .catch(this.notificationsService.updateError().entity('entities.formulas.gen.singular').dispatchCallback());
  }

  delete(formulaId: number): Observable<any> {
    return this.dataService.delete(`${this.baseUrl}/{formulaId}`, { formulaId })
      .catch(this.notificationsService.deleteError().entity('entities.formulas.gen.singular').dispatchCallback());
  }

  calculate(formulaId: number, params: IFormulaParams): Observable<IFormulaResult> {
    return this.dataService.create(`${this.baseUrl}/{formulaId}/calculate`, { formulaId }, params)
      .map(response => this.mapResult(response))
      .catch(
        this.notificationsService
          .error('routes.utilities.formulas.errors.calculate')
          .entity('entities.formulas.gen.singular')
          .dispatchCallback()
      );
  }

  // TODO (i.kibisov): remove mock
  fetchFormulasMetadata(): Observable<IScriptEditorDefs[]> {
    // return this.dataService.read(`${this.baseUrl}/data`, {})
      // .catch(this.notificationsService.fetchError().entity('entities.formulas.gen.singular').dispatchCallback());
    return of([{
      '!name': 'Context',
      '!define': {
        'contractor': {
          'smsName': {
            '!doc': 'Название для СМС',
            '!type': 'stringEx'
          },
          'contractorType': {
            '!doc': 'Тип контрагента',
            '!type': 'number'
          },
          'name': {
            '!doc': 'Название',
            '!type': 'stringEx'
          },
          'fullName': {
            '!doc': 'Полное название',
            '!type': 'stringEx'
          },
          'responsibleId': {
            '!doc': 'Ответственный пользователь',
            '!type': 'number'
          }
        },
        'components': {
          'amountType': {
            '!doc': 'Тип составляющей',
            '!type': 'number'
          },
          'amount': {
            '!doc': 'Сумма',
            '!type': 'number'
          },
          'currencyId': {
            '!doc': 'Валюта',
            '!type': 'number'
          }
        },
        'ctx': {
          'person': {
            '!doc': 'Информация о персоне',
            '!type': 'person'
          },
          'debt': {
            '!doc': 'Долг из контекста выполнения формулы',
            '!type': 'debt'
          },
          'user': {
            '!doc': 'Пользователь из контекста выполнения формулы',
            '!type': 'user'
          }
        },
        'payments': {
          'paymentDt': {
            '!doc': 'Дата платежа',
            '!type': 'date'
          },
          'amount': {
            '!doc': 'Сумма платежа в валюте',
            '!type': 'number'
          },
          'receiveDt': {
            '!doc': 'Дата учета платежа',
            '!type': 'date'
          },
          'confirmDt': {
            '!doc': 'Дата подтверждения',
            '!type': 'date'
          },
          'cancelDt': {
            '!doc': 'Дата отмены платежа',
            '!type': 'date'
          },
          'isCanceled': {
            '!doc': 'Признак отмены платежа',
            '!type': 'bool'
          },
          'reqUserId': {
            '!doc': 'Коллектор (заявка)',
            '!type': 'number'
          },
          'purpose': {
            '!doc': 'Назначение платежа',
            '!type': 'number'
          },
          'userId': {
            '!doc': 'Коллектор (факт)',
            '!type': 'number'
          },
          'promiseId': {
            '!doc': 'Ссылка на обещание',
            '!type': 'number'
          },
          'isConfirmed': {
            '!doc': 'Признак подтвержденного платежа',
            '!type': 'bool'
          },
          'commission': {
            '!doc': 'Комиссия',
            '!type': 'number'
          },
          'amountMainCur': {
            '!doc': 'Сумма платежа в основной валюте системы',
            '!type': 'number'
          },
          'currencyId': {
            '!doc': 'Валюта',
            '!type': 'number'
          },
          'receiptNumber': {
            '!doc': 'Номер квитанции',
            '!type': 'stringEx'
          }
        },
        'pledgeContracts': {
          'contactEndDt': {
            '!doc': 'Дата окончания договора',
            '!type': 'date'
          },
          'contractNumber': {
            '!doc': 'Номер договора',
            '!type': 'stringEx'
          },
          'contractStartDt': {
            '!doc': 'Дата договора',
            '!type': 'date'
          }
        },
        'guaranteeContracts': {
          'contactEndDt': {
            '!doc': 'Дата окончания договора',
            '!type': 'date'
          },
          'contractType': {
            '!doc': 'Тип ответственности',
            '!type': 'number'
          },
          'contractNumber': {
            '!doc': 'Номер договора поручительства',
            '!type': 'stringEx'
          },
          'contractStartDt': {
            '!doc': 'Дата договора поручительства',
            '!type': 'date'
          }
        },
        'portfolio': {
          'startWorkDt': {
            '!doc': 'Дата начала работ',
            '!type': 'date'
          },
          'portfolioType': {
            '!doc': 'Тип портфеля',
            '!type': 'number'
          },
          'stage': {
            '!doc': 'Стадия',
            '!type': 'number'
          },
          'name': {
            '!doc': 'Название портфеля',
            '!type': 'stringEx'
          },
          'signDt': {
            '!doc': 'Дата подписания',
            '!type': 'date'
          },
          'endWorkDt': {
            '!doc': 'Дата окончания работ',
            '!type': 'date'
          },
          'status': {
            '!doc': 'Статус',
            '!type': 'number'
          }
        },
        'person': {
          'lastName': {
            '!doc': 'Фамилия / Название компании',
            '!type': 'stringEx'
          },
          'birthDt': {
            '!doc': 'Дата рождения',
            '!type': 'date'
          },
          'education': {
            '!doc': 'Образование',
            '!type': 'number'
          },
          'gender': {
            '!doc': 'Пол',
            '!type': 'number'
          },
          'stringValue10': {
            '!doc': 'Строковое поле 10',
            '!type': 'stringEx'
          },
          'stringValue1': {
            '!doc': 'Строковое поле 1',
            '!type': 'stringEx'
          },
          'firstName': {
            '!doc': 'Имя персоны',
            '!type': 'stringEx'
          },
          'birthPlace': {
            '!doc': 'Место рождения',
            '!type': 'stringEx'
          },
          'stringValue3': {
            '!doc': 'Строковое поле 3',
            '!type': 'stringEx'
          },
          'stringValue2': {
            '!doc': 'Строковое поле 2',
            '!type': 'stringEx'
          },
          'stage': {
            '!doc': 'Стадия должника',
            '!type': 'number'
          },
          'stringValue5': {
            '!doc': 'Строковое поле 5',
            '!type': 'stringEx'
          },
          'stringValue4': {
            '!doc': 'Строковое поле 4',
            '!type': 'stringEx'
          },
          'stringValue7': {
            '!doc': 'Строковое поле 7',
            '!type': 'stringEx'
          },
          'stringValue6': {
            '!doc': 'Строковое поле 6',
            '!type': 'stringEx'
          },
          'stringValue9': {
            '!doc': 'Строковое поле 9',
            '!type': 'stringEx'
          },
          'stringValue8': {
            '!doc': 'Строковое поле 8',
            '!type': 'stringEx'
          },
          'middleName': {
            '!doc': 'Отчество персоны',
            '!type': 'stringEx'
          },
          'personType': {
            '!doc': 'Тип персоны',
            '!type': 'number'
          },
          'familyStatus': {
            '!doc': 'Семейное пололжение',
            '!type': 'number'
          }
        },
        'debt': {
          'callSuccessCnt': {
            '!doc': 'Количество успешных звонков',
            '!type': 'number'
          },
          'portfolioOut': {
            '!doc': 'Информация о входящем портфеле долга',
            '!type': 'portfolio'
          },
          'branch': {
            '!doc': 'Филиал',
            '!type': 'number'
          },
          'creditType': {
            '!doc': 'Тип кредитного продукта',
            '!type': 'number'
          },
          'lastConfirmedPaymentDt': {
            '!doc': 'Дата последнего подтвержденного платежа',
            '!type': 'date'
          },
          'statusReason': {
            '!doc': 'Причина перехода в текущий статус',
            '!type': 'number'
          },
          'portfolio': {
            '!doc': 'Информация о входящем портфеле долга',
            '!type': 'portfolio'
          },
          'unconfirmedPaymentCnt': {
            '!doc': 'Количество неподтвержденных платежей',
            '!type': 'number'
          },
          'callCnt': {
            '!doc': 'Количество звонков',
            '!type': 'number'
          },
          'visitSuccessCnt': {
            '!doc': 'Количество успешных выездов',
            '!type': 'number'
          },
          'promises': {
            '!doc': 'Платежи текущего долга',
            '!type': '[promises]'
          },
          'debtAmount': {
            '!doc': 'Общая сумма просроченной задолженности',
            '!type': 'number'
          },
          'responsibleUser': {
            '!doc': 'Информация об ответственном по долгу',
            '!type': 'user'
          },
          'unconfirmedPaymentAmount': {
            '!doc': 'Сумма неподтвержденных платежей в основной валюте',
            '!type': 'number'
          },
          'contract': {
            '!doc': 'Номер договора',
            '!type': 'stringEx'
          },
          'visitUnsuccessCnt': {
            '!doc': 'Количество неуспешных выездов',
            '!type': 'number'
          },
          'creditEndDt': {
            '!doc': 'Дата окончания кредитного срока',
            '!type': 'date'
          },
          'timeZone': {
            '!doc': 'Часовой пояс',
            '!type': 'number'
          },
          'paymentCoverPromiseCnt': {
            '!doc': 'Количество платежей, покрывающих обещания',
            '!type': 'number'
          },
          'nextCallDt': {
            '!doc': 'Дата следующего звонка',
            '!type': 'date'
          },
          'paymentNotCoverPromiseCnt': {
            '!doc': 'Количество платежей, не покрывающих обещания',
            '!type': 'number'
          },
          'totalAmount': {
            '!doc': 'Общая сумма кредита',
            '!type': 'number'
          },
          'pledgeCnt': {
            '!doc': 'Количество договоров залога',
            '!type': 'number'
          },
          'creditStartDt': {
            '!doc': 'Дата выдачи кредита',
            '!type': 'date'
          },
          'region': {
            '!doc': 'Регион',
            '!type': 'number'
          },
          'lastUnconfirmedPaymentDt': {
            '!doc': 'Дата последнего неподтвержденного платежа',
            '!type': 'date'
          },
          'status': {
            '!doc': 'Статус долга',
            '!type': 'number'
          },
          'contractor': {
            '!doc': 'Контрагент для входящего портфеля долга',
            '!type': 'contractor'
          },
          'components': {
            '!doc': 'Составляющие по долгу',
            '!type': '[components]'
          },
          'promiseFulfilledAmount': {
            '!doc': 'Сумма выполненных обещаний',
            '!type': 'number'
          },
          'dictValue2': {
            '!doc': 'Словарный атрибут 2',
            '!type': 'number'
          },
          'dictValue1': {
            '!doc': 'Словарный атрибут 1',
            '!type': 'number'
          },
          'payments': {
            '!doc': 'Платежи текущего долга',
            '!type': '[payments]'
          },
          'dictValue4': {
            '!doc': 'Словарный атрибут 4',
            '!type': 'number'
          },
          'dictValue3': {
            '!doc': 'Словарный атрибут 3',
            '!type': 'number'
          },
          'confirmedPaymentAmount': {
            '!doc': 'Сумма подтвержденных платежей в основной валюте',
            '!type': 'number'
          },
          'promiseWaitingCnt': {
            '!doc': 'Количество обещаний со статусом «ожидание»',
            '!type': 'number'
          },
          'guaranteeContracts': {
            '!doc': 'Договоры поручительства',
            '!type': '[guaranteeContracts]'
          },
          'contractorOut': {
            '!doc': 'Контрагент для исходящего портфеля долга',
            '!type': 'contractor'
          },
          'callUnsuccessCnt': {
            '!doc': 'Количество неуспешных звонков',
            '!type': 'number'
          },
          'debtor': {
            '!doc': 'Должник текущего долга',
            '!type': 'person'
          },
          'debtReason': {
            '!doc': 'Причина возникновения задолженности',
            '!type': 'number'
          },
          'promiseOverdueCnt': {
            '!doc': 'Количество просроченных обещаний',
            '!type': 'number'
          },
          'dpd': {
            '!doc': 'Количество дней просрочки по кредиту',
            '!type': 'number'
          },
          'debtDt': {
            '!doc': 'Дата актуальности остатка',
            '!type': 'date'
          },
          'pledgeContracts': {
            '!doc': 'Договоры залога',
            '!type': '[pledgeContracts]'
          },
          'visitCnt': {
            '!doc': 'Количество выездов',
            '!type': 'number'
          },
          'confirmedPaymentCnt': {
            '!doc': 'Количество подтвержденных платежей',
            '!type': 'number'
          },
          'promiseFulfilledCnt': {
            '!doc': 'Количество выполненных обещаний',
            '!type': 'number'
          },
          'stage': {
            '!doc': 'Стадия долга',
            '!type': 'number'
          },
          'lastPromiseAmount': {
            '!doc': 'Размер последнего обещания',
            '!type': 'number'
          },
          'startDt': {
            '!doc': 'Дата выхода на просрочку',
            '!type': 'date'
          },
          'contactCnt': {
            '!doc': 'Общее количество контактов',
            '!type': 'number'
          },
          'currencyId': {
            '!doc': 'Валюта кредита',
            '!type': 'number'
          },
          'guaranteeCnt': {
            '!doc': 'Количество договоров поручительства',
            '!type': 'number'
          },
          'creditName': {
            '!doc': 'Название кредитного продукта',
            '!type': 'stringEx'
          },
          'account': {
            '!doc': 'Лицевой счет',
            '!type': 'stringEx'
          },
          'contacts': {
            '!doc': 'Контакты',
            '!type': '[contacts]'
          }
        },
        'promises': {
          'amount': {
            '!doc': 'Сумма обещания',
            '!type': 'number'
          },
          'receiveDt': {
            '!doc': 'Дата получения обещания',
            '!type': 'date'
          },
          'isUnconfirmed': {
            '!doc': 'Признак необходимости разрешения',
            '!type': 'bool'
          },
          'promiseDt': {
            '!doc': 'Дата обещания',
            '!type': 'date'
          },
          'userId': {
            '!doc': 'Ссылка на пользователя',
            '!type': 'number'
          },
          'coverAmount': {
            '!doc': 'Покрытая сумма',
            '!type': 'number'
          },
          'status': {
            '!doc': 'Статус обещаний',
            '!type': 'number'
          }
        },
        'user': {
          'role': {
            '!doc': 'Роль пользователя',
            '!type': 'number'
          },
          'stage': {
            '!doc': 'Стадия, на которой работает пользователь',
            '!type': 'number'
          },
          'mainOrganizationRole': {
            '!doc': 'Роль в основном подразделении',
            '!type': 'number'
          },
          'position': {
            '!doc': 'Должность',
            '!type': 'stringEx'
          },
          'login': {
            '!doc': 'Логин',
            '!type': 'stringEx'
          },
          'mainOrganizationId': {
            '!doc': 'Ссылка на основное подразделение пользователя',
            '!type': 'number'
          },
          'branch': {
            '!doc': 'Филиал',
            '!type': 'number'
          }
        },
        'contacts': {
          'promiseId': {
            '!doc': 'Ссылка на обещание',
            '!type': 'number'
          },
          'paymentId': {
            '!doc': 'Ссылка на платеж',
            '!type': 'number'
          },
          'campaignId': {
            '!doc': 'ID кампании обзвона',
            '!type': 'number'
          },
          'isRefusal': {
            '!doc': 'Отказ от оплаты',
            '!type': 'bool'
          },
          'contactTreeCode': {
            '!doc': 'Код дерева контактов',
            '!type': 'number'
          },
          'personRole': {
            '!doc': 'Роль персоны',
            '!type': 'number'
          },
          'contactType': {
            '!doc': 'Тип контакта',
            '!type': 'number'
          },
          'personId': {
            '!doc': 'Ссылка на персону',
            '!type': 'number'
          },
          'callReason': {
            '!doc': 'Причина звонка должника',
            '!type': 'number'
          },
          'userId': {
            '!doc': 'Пользователь, зарегистрировавший контакт',
            '!type': 'number'
          },
          'contactDt': {
            '!doc': 'Дата контакта',
            '!type': 'stringEx'
          },
          'isSuccess': {
            '!doc': 'Признак успешности контакта',
            '!type': 'bool'
          }
        },
        'date': {
                'value': 'string',
                'after': {
                    '!doc': 'Проверяет является ли данная дата позже аргумента',
                    '!type': 'fn(date: date) -> bool'
                },
          'before': {
                    '!doc': 'Проверяет является ли данная дата раньше аргумента',
                    '!type': 'fn(date: date) -> bool'
                },
          'getAt': {
                    '!doc': 'Возвращает часть даты. Возможные аргументы: Calendar.DATE (5) - день месяца,'
                      + ' Calendar.MONTH (2) - номер месяц от нуля, Calendar.YEAR (1) - год',
                    '!type': 'fn(datePart: number) -> number'
                }
            },
        'stringEx': {
                'value': 'string',
                'substring': {
                    '!doc': 'Возвращает подстроку исходной строки. Подстрока начинается с beginIndex'
                      + ' и заканчивается на endIndex - 1. Например, substring(1, 5) от «машина» будет «ашин»',
                    '!type': 'fn(beginIndex: number, endIndex: number) -> stringEx'
                }
            }
      },
      'ctx': {
        '!doc': 'Контекст выполнения формулы',
        '!type': 'ctx'
      }
    }]);
  }

  private mapResult(response: any): IFormulaResult {
    return {
      success: response.success,
      ...(response.success ? response.data[0] : {})
    };
  }
}
