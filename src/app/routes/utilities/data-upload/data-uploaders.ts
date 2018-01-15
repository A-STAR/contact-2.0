
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
    protected guid: number;

    constructor(
        public dataService: DataService,
        public gridService: GridService,
        // private notificationsService: NotificationsService,
    ) { }

    openFile(file: File, url: string): Observable<IOpenFileResponse> {
        return this.dataService
            .createMultipart(url, {}, {}, file)
            .pipe(
            map(response => response.data[0]),
            tap(data => this.guid = data.guid),
        );
    }

    fetch(params: IAGridRequestParams, url: string): Observable<IDataResponse> {
        const { guid } = this;
        const request = this.gridService.buildRequest(params, null);
        return this.dataService
            .create(url, { guid }, request);
    }

    editCell(cell: ICellPayload, url: string): Observable<IDataResponse> {
        const { guid } = this;
        return this.dataService
            .update(url, { guid }, cell)
            .pipe(
            map(response => response.data[0]),
        );
    }

    deleteRow(rowId: number, url: string): Observable<void> {
        const { guid } = this;
        return this.dataService
            .delete(url, { guid, rowId });
    }

    save(url: string): Observable<IMassInfoResponse> {
        const { guid } = this;
        return this.dataService
            .create(url, { guid }, {});
    }

    getErrors(url: string): Observable<IErrorsResponse> {
        const { guid } = this;
        return this.dataService
            .read(url, { guid });
    }

    cancel(url: string): Observable<void> {
        const { guid } = this;
        return this.dataService
            .delete(url, { guid });
    }
}

class SetOperatorUploader extends DataUploader {
    constructor(
        dataService: DataService,
        gridService: GridService,
        private uploaderConfig: IDataUploaderConfig
        // private notificationsService: NotificationsService,
    ) {
        super(dataService, gridService);
    }

    openFile(file: File): Observable<IOpenFileResponse> {
        return super.openFile(file, this.uploaderConfig.fromExcel);
    }

    fetch(params: IAGridRequestParams): Observable<IDataResponse> {
        return super.fetch(params, this.uploaderConfig.fromLoadedExcel);
    }

    editCell(cell: ICellPayload, url: string): Observable<IDataResponse> {
        const { guid } = this;
        return this.dataService
            .update(url, { guid }, cell)
            .pipe(
            map(response => response.data[0]),
        );
    }

    deleteRow(rowId: number, url: string): Observable<void> {
        const { guid } = this;
        return this.dataService
            .delete(url, { guid, rowId });
    }

    save(url: string): Observable<IMassInfoResponse> {
        const { guid } = this;
        return this.dataService
            .create(url, { guid }, {});
    }

    getErrors(url: string): Observable<IErrorsResponse> {
        const { guid } = this;
        return this.dataService
            .read(url, { guid });
    }

    cancel(url: string): Observable<void> {
        const { guid } = this;
        return this.dataService
            .delete(url, { guid });
    }
}

@Injectable()
export class DataUploadService {

    private static UPLOADERS_CONFIG: IUploadersConfig = {
        [DataUploaders.CURRENCY_RATE]: {
            fromExcel: '/load/currencies/{currenciesId}/rates',
            fromLoadedExcel: '/load/currencies/{currenciesId}/rates/guid/{tempDataGuid}',
            editExcel: '/load/currencies/{currenciesId}/rates/guid/{tempDataGuid}',
            removeRow: '/load/currencies/{currenciesId}/rates/guid/{tempDataGuid}/row/{rowIds}',
            cancelLoading: '/load/currencies/{currenciesId}/rates/guid/{tempDataGuid}',
            saveDB: '/load/currencies/{currenciesId}/rates/guid/{tempDataGuid}/save',
            errorFile: '/load/currencies/{currenciesId}/rates/guid/{tempDataGuid}/error'
        },
        [DataUploaders.CONTACT_HISTORY]: {
            fromExcel: '/load/contactHistory',
            fromLoadedExcel: '/load/contactHistory/guid/{tempDataGuid}',
            editExcel: '/load/contactHistory/guid/{tempDataGuid}',
            removeRow: '/load/contactHistory/guid/{tempDataGuid}/row/{rowIds}',
            cancelLoading: '/load/contactHistory/guid/{tempDataGuid}',
            saveDB: '/load/contactHistory/guid/{tempDataGuid}/save',
            errorFile: '/load/contactHistory/guid/{tempDataGuid}/error'
        },
        [DataUploaders.DEBTS]: {
            fromExcel: '/load/debts',
            fromLoadedExcel: '/load/debts/guid/{tempDataGuid}',
            editExcel: '/load/debts/guid/{tempDataGuid}',
            removeRow: '/load/debts/guid/{tempDataGuid}/row/{rowIds}',
            cancelLoading: '/load/debts/guid/{tempDataGuid}',
            saveDB: '/load/debts/guid/{tempDataGuid}/save',
            errorFile: '/load/debts/guid/{tempDataGuid}/error'
        },
        [DataUploaders.PAYMENT]: {
            fromExcel: '/load/payments/format/{formatCode}',
            fromLoadedExcel: '/load/payments/format/{formatCode}/guid/{tempDataGuid}',
            editExcel: '/load/payments/format/{formatCode}/guid/{tempDataGuid}',
            removeRow: '/load/payments/format/{formatCode}/guid/{tempDataGuid}/row/{rowIds}',
            cancelLoading: '/load/payments/format/{formatCode}/guid/{tempDataGuid}',
            saveDB: '/load/payments/format/{formatCode}/guid/{tempDataGuid}/save',
            errorFile: '/load/payments/format/{formatCode}/guid/{tempDataGuid}/error'
        },
        [DataUploaders.SET_OPERATOR]: {
            fromExcel: '/load/debtSetOperator',
            fromLoadedExcel: '/load/debtSetOperator/guid/{tempDataGuid}',
            editExcel: '/load/debtSetOperator/guid/{tempDataGuid}',
            removeRow: '/load/debtSetOperator/guid/{tempDataGuid}/row/{rowIds}',
            cancelLoading: '/load/debtSetOperator/guid/{tempDataGuid}',
            saveDB: '/load/debtSetOperator/guid/{tempDataGuid}/save',
            errorFile: '/load/debtSetOperator/guid/{tempDataGuid}/error'
        },
    };

    private uploaders = {};

    private currentUploaderType;

    private uploadersCtors = {
        [DataUploaders.SET_OPERATOR]: SetOperatorUploader,
        // TODO:(i.lobanov) implement the rest of uploaders
        [DataUploaders.PAYMENT]: SetOperatorUploader,
        [DataUploaders.DEBTS]: SetOperatorUploader,
        [DataUploaders.CONTACT_HISTORY]: SetOperatorUploader,
        [DataUploaders.CURRENCY_RATE]: SetOperatorUploader,
    };

    constructor(
        private dataService: DataService,
        private gridService: GridService,
        // private notificationsService: NotificationsService,
    ) { }

    set uploader(uploaderType: any) {
        this.instantiate(uploaderType);
        this.currentUploaderType = uploaderType;
    }

    get uploader(): any {
        return this.uploaders[this.currentUploaderType] ||
            (this.uploaders[this.currentUploaderType] = this.instantiate(this.currentUploaderType));
    }

    private instantiate(uploaderType: any): any {
        if (!this.uploaders[uploaderType]) {
            this.uploaders[uploaderType] = new this.uploadersCtors[this.currentUploaderType](this.dataService,
                this.gridService, DataUploadService.UPLOADERS_CONFIG[uploaderType]);
        }
        return this.uploaders[uploaderType];
    }
}



