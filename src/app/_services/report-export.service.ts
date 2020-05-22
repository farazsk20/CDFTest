import { Injectable, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { default as jsPDF } from 'jspdf';
import { default as html2canvas } from 'html2canvas';
import * as XLSX from 'xlsx';
import { CDF } from '../_models/cdf';
import { CDFLocation } from '../_models/cdflocation';

@Injectable({
    providedIn: 'root'
})
export class ReportExportService {

    public ExportExcel(cont: ElementRef, cdf: CDF, bid: CDFLocation){
        const workBookName = 'CDF_' + cdf.Title + '_' + bid.Location.Name;
        const content = cont.nativeElement;
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(content, { raw: true });
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'CDF');
        /* save to file */
        XLSX.writeFile(wb, workBookName + '.xlsx');
    }
    public ExportPDF(cont: ElementRef, cdf: CDF, bid: CDFLocation){
        const pdfName = 'CDF_' + cdf.Title + '_' + bid.Location.Name;
        const content = cont.nativeElement;

        var currentPosition = content.scrollTop;
        var HTML_Width = content.offsetWidth;
        var HTML_Height = content.offsetHeight;
        var top_left_margin = 1;
        var PDF_Width = HTML_Width + (top_left_margin * 2);
        var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
        var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
        html2canvas(content, { width: PDF_Width, height: PDF_Height }).then(function (canvas) {
            canvas.getContext('2d');
            console.log(canvas.height + "  " + canvas.width);
            var imgData = canvas.toDataURL("image/jpeg");
            var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
            pdf.addImage(imgData, 'JPG', 0, 0);
            for (var i = 1; i <= totalPDFPages; i++) {
                pdf.addPage(PDF_Width, PDF_Height);
                pdf.addImage(imgData, 'JPG', 0, 0);
            }
            pdf.save(pdfName + ".pdf");
        });
        content.style.height = "100px";
        content.scrollTop = currentPosition;
    }
}