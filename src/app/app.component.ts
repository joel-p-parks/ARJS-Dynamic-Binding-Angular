import { Component, ViewChild } from "@angular/core";

import { ViewerComponent, AR_EXPORTS, PdfExportService, HtmlExportService, TabularDataExportService } from "@grapecity/activereports-angular";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    {
      provide: AR_EXPORTS,
      useClass: PdfExportService,
      multi: true,
    },
    {
      provide: AR_EXPORTS,
      useClass: HtmlExportService,
      multi: true,
    },
    {
      provide: AR_EXPORTS,
      useClass: TabularDataExportService,
      multi: true,
    },
  ],
})
export class AppComponent {
  @ViewChild(ViewerComponent, { static: false }) reportViewer: ViewerComponent;
  dataSetFields = [
    {
      "Name": "productId",
      "DataField": "productId"
    },
    {
      "Name": "productName",
      "DataField": "productName"
    },
    {
      "Name": "supplierId",
      "DataField": "supplierId"
    },
    {
      "Name": "categoryId",
      "DataField": "categoryId"
    },
    {
      "Name": "quantityPerUnit",
      "DataField": "quantityPerUnit"
    },
    {
      "Name": "unitPrice",
      "DataField": "unitPrice"
    },
    {
      "Name": "unitsInStock",
      "DataField": "unitsInStock"
    },
    {
      "Name": "unitsOnOrder",
      "DataField": "unitsOnOrder"
    },
    {
      "Name": "reorderLevel",
      "DataField": "reorderLevel"
    },
    {
      "Name": "discontinued",
      "DataField": "discontinued"
    }
  ];
  async loadData() {
    const headers = new Headers();
    const dataRequest = new Request(
      "https://demodata.grapecity.com/northwind/api/v1/Products",
      {
        headers: headers,
      }
    );
    const response = await fetch(dataRequest);
    const data = await response.json();
    return data;
  }

  async loadReport() {
    const reportResponse = await fetch(
      "/assets/DynamicBindingTwo.rdlx-json"
    );
    const report = await reportResponse.json();
    return report;
  }

  async onViewerInit() {
    const data = await this.loadData();
    const report = await this.loadReport();
    report.DataSources[0].ConnectionProperties.ConnectString = "jsondata=" + JSON.stringify(data);
    report.DataSets[0].Fields = this.dataSetFields;
    report.DataSets[0].Query.CommandText = "jpath=$.*";
    console.log(report);
    this.reportViewer.open(report);
  }
}
