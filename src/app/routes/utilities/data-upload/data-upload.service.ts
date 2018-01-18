
import { Injectable } from '@angular/core';

import { IAGridRequestParams } from '../../../shared/components/grid2/grid2.interface';
import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';

import {
    DataUploaders,
    ICellPayload,
    IErrorsResponse,
    IDataResponse,
    IOpenFileResponse,
    IUploadersConfig,
    IDataUploaderConfig,
} from './data-upload.interface';
import { IMassInfoResponse } from '../../../core/data/data.interface';

import { DataService } from '../../../core/data/data.service';
import { GridService } from '../../../shared/components/grid/grid.service';

class DataUploader {
    public guid: number;
    public parameter: any;

    constructor(
        public dataService: DataService,
        public gridService: GridService,
        public api: IDataUploaderConfig,
        private paramKey?: string
        // private notificationsService: NotificationsService,
    ) { }

    openFile(file: File): Observable<IOpenFileResponse> {
        return this.dataService
            .createMultipart(this.api.openFile, this.buildRequestParams(), {}, file)
            .pipe(
            map(response => response.data[0]),
            tap(data => this.guid = data.guid),
        );
    }

    fetch(params: IAGridRequestParams): Observable<IDataResponse> {
        const request = this.gridService.buildRequest(params, null);
        return this.dataService
            .create(this.api.fetch, this.buildRequestParams(), request);
    }

    editCell(cell: ICellPayload): Observable<IDataResponse> {
        return this.dataService
            .update(this.api.editCell, this.buildRequestParams(), cell)
            .pipe(
            map(response => response.data[0]),
        );
    }

    deleteRow(rowId: number): Observable<void> {
        return this.dataService
            .delete(this.api.deleteRow, this.buildRequestParams(rowId));
    }

    save(): Observable<IMassInfoResponse> {
        return this.dataService
            .create(this.api.save, this.buildRequestParams(), {});
    }

    getErrors(): Observable<IErrorsResponse> {
        return this.dataService
            .read(this.api.getErrors, this.buildRequestParams());
    }

    cancel(): Observable<void> {
        return this.dataService
            .delete(this.api.cancel, this.buildRequestParams());
    }

    private buildRequestParams(rowId?: number): object {
        const result = {} as any;
        if (this.guid) {
            result.guid = this.guid;
        }
        if (this.parameter && this.paramKey) {
            result[this.paramKey] = this.parameter;
        }
        if (rowId) {
            result.rowId = rowId;
        }
        return result;
    }
}
/**
 * Spec:       http://confluence.luxbase.int:8090/pages/viewpage.action?pageId=140181557
 * API:        http://confluence.luxbase.int:8090/display/WEB20/Load+Data
 * Validation: http://confluence.luxbase.int:8090/pages/viewpage.action?pageId=137723952
 */
@Injectable()
export class DataUploadService {

    private static UPLOADERS_CONFIG: IUploadersConfig = {
        [DataUploaders.CURRENCY_RATE]: {
            openFile: '/load/currencies/{currenciesId}/rates',
            fetch: '/load/currencies/{currenciesId}/rates/guid/{guid}',
            editCell: '/load/currencies/{currenciesId}/rates/guid/{guid}',
            deleteRow: '/load/currencies/{currenciesId}/rates/guid/{guid}/row/{rowIds}',
            cancel: '/load/currencies/{currenciesId}/rates/guid/{guid}',
            save: '/load/currencies/{currenciesId}/rates/guid/{guid}/save',
            getErrors: '/load/currencies/{currenciesId}/rates/guid/{guid}/error',
            paramKey: 'currenciesId'
        },
        [DataUploaders.CONTACT_HISTORY]: {
            openFile: '/load/contactHistory',
            fetch: '/load/contactHistory/guid/{guid}',
            editCell: '/load/contactHistory/guid/{guid}',
            deleteRow: '/load/contactHistory/guid/{guid}/row/{rowIds}',
            cancel: '/load/contactHistory/guid/{guid}',
            save: '/load/contactHistory/guid/{guid}/save',
            getErrors: '/load/contactHistory/guid/{guid}/error'
        },
        [DataUploaders.DEBTS]: {
            openFile: '/load/debts',
            fetch: '/load/debts/guid/{guid}',
            editCell: '/load/debts/guid/{guid}',
            deleteRow: '/load/debts/guid/{guid}/row/{rowIds}',
            cancel: '/load/debts/guid/{guid}',
            save: '/load/debts/guid/{guid}/save',
            getErrors: '/load/debts/guid/{guid}/error'
        },
        [DataUploaders.PAYMENT]: {
            openFile: '/load/payments/format/{formatCode}',
            fetch: '/load/payments/format/{formatCode}/guid/{guid}',
            editCell: '/load/payments/format/{formatCode}/guid/{guid}',
            deleteRow: '/load/payments/format/{formatCode}/guid/{guid}/row/{rowIds}',
            cancel: '/load/payments/format/{formatCode}/guid/{guid}',
            save: '/load/payments/format/{formatCode}/guid/{guid}/save',
            getErrors: '/load/payments/format/{formatCode}/guid/{guid}/error',
            paramKey: 'formatCode'
        },
        [DataUploaders.SET_OPERATOR]: {
            openFile: '/load/debtSetOperator',
            fetch: '/load/debtSetOperator/guid/{guid}',
            editCell: '/load/debtSetOperator/guid/{guid}',
            deleteRow: '/load/debtSetOperator/guid/{guid}/row/{rowIds}',
            cancel: '/load/debtSetOperator/guid/{guid}',
            save: '/load/debtSetOperator/guid/{guid}/save',
            getErrors: '/load/debtSetOperator/guid/{guid}/error'
        },
    };

    private uploaders = {};

    private currentUploaderType: DataUploaders;

    private uploaderTypes = [
        null,
        DataUploaders.SET_OPERATOR,
        DataUploaders.PAYMENT,
        DataUploaders.DEBTS,
        DataUploaders.CONTACT_HISTORY,
        DataUploaders.CURRENCY_RATE
    ];

    constructor(
        private dataService: DataService,
        private gridService: GridService,
        // private notificationsService: NotificationsService,
    ) { }

    get format(): number {
        return this.uploaderTypes.indexOf(this.currentUploaderType);
    }

    set format(value: number) {
        this.currentUploaderType = this.uploaderTypes[value];
    }

    get uploader(): DataUploader {
        return this.uploaders[this.currentUploaderType] ||
            (this.uploaders[this.currentUploaderType] = this.instantiate(this.currentUploaderType));
    }

    private instantiate(uploaderType: DataUploaders): DataUploader {
        if (!this.uploaders[uploaderType]) {
            const paramKey = DataUploadService.UPLOADERS_CONFIG[uploaderType]
                && DataUploadService.UPLOADERS_CONFIG[uploaderType].paramKey;

            this.uploaders[uploaderType] = new DataUploader(this.dataService,
                this.gridService, DataUploadService.UPLOADERS_CONFIG[uploaderType], paramKey);
        }
        return this.uploaders[uploaderType];
    }
}



