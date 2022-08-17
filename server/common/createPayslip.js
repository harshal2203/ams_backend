import _, { lowerFirst } from 'lodash';
import moment from 'moment';
import fs from "fs";
import PDFDocument from "pdfkit";


const createPayslip = (payslip, path) => {
    let doc = new PDFDocument({ size: "A4", margin: 50 });

    generateHeader(doc, payslip);
    generateCustomerInformation(doc, payslip);
    generatePayslipTable(doc, payslip);
    doc.end();
    doc.pipe(fs.createWriteStream(path));
}

const getCalculatedTotal = (payslip, type) => {
    const items = _.get(payslip, "items", [])
    let value = 0;
    items.map((data) => {
        value = type === 'gst' ? parseInt(value) + parseInt(data.rate * data.qty * 18 / 100) : parseInt(value) + parseInt(data.rate * data.qty);
    });

    return value;
}

const generateHeader = (doc, payslip) => {

    doc
        .image("DevlatsLogo.png", 420, 70, { width: 120, height: 25 })
        .fillColor("#444444")
        .font("Helvetica-Bold").fontSize(15)
        .text("DEVLATS Private Limited", 100, 95)
        .font("Helvetica").fontSize(10)
        .text("Regd.Off: Unit No.605,Solaris 1 ,", 100, 120)
        .text("Saki Vihar Raod, Andheri(East),Mumbai- 400 072 India", 100, 135)
        .text("Tel:+91 00 0000 0000 Fac: +91 00 0000 0000", 100, 150)
        .moveDown();

}

const generateCustomerInformation = (doc, payslip) => {
    generateHrb(doc, 185);
    generateHr(doc, 200);

    const firstName = _.get(payslip, 'dataValues.first_name', "");
    const address = _.get(payslip, 'dataValues.address', "");
    const phone = _.get(payslip, 'dataValues.phone', "");

    const customerInformationTop = 200;

    doc
        .fontSize(9.5)
        .text("PAYSLIP", 60, customerInformationTop - 10, { align: "center" })
        .font("Helvetica-Bold").fontSize(11)
        .text("Employee Name", 50, customerInformationTop + 18)
        .text(":", 140, customerInformationTop + 18)
        .text("Designation", 50, customerInformationTop + 37)
        .text(":", 140, customerInformationTop + 37)
        .text("Location", 50, customerInformationTop + 54)
        .text(":", 140, customerInformationTop + 54)
        .text("Employee Pan", 150, customerInformationTop + 18, { align: "center" })
        .text(":", 260, customerInformationTop + 18, { align: "center" })
        .text("Date of Joining", 155, customerInformationTop + 37, { align: "center" })
        .text(":", 260, customerInformationTop + 37, { align: "center" })
        .text("PF A/c. No.(UNA)", 160, customerInformationTop + 54, { align: "center" })
        .text(":", 260, customerInformationTop + 54, { align: "center" })

        .font("Helvetica").fontSize(11)
        .text(firstName, 150, customerInformationTop + 18)
        .text("Software devloper", 150, customerInformationTop + 37)
        .text(address, 150, customerInformationTop + 54)
        .text(firstName, 300, customerInformationTop + 18, { align: "center" })
        .text("Software devloper", 370, customerInformationTop + 37, { align: "center" })
        .text(address, 310, customerInformationTop + 54, { align: "center" })
        .moveDown();
    generateHrb(doc, 285);
    generateHrb(doc, 50);

}

const generatePayslipTable = (doc, payslip) => {

    let payslipTableTop = 290;
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        payslipTableTop,
        "Attendence Details",
        "Value",
        "Playslip for july,2020"
    );

    generateHrb(doc, payslipTableTop + 16);
    doc.font("Helvetica").fontSize(10);
    generateTableRow(
        doc
            .font("Helvetica").fontSize(11)
            .text("Total Days", 50, payslipTableTop + 21)
            .text(31, 350, payslipTableTop + 21)
            .text("Absent", 50, payslipTableTop + 41)
            .text(0, 355, payslipTableTop + 41)
            .text("Casual Leave", 50, payslipTableTop + 60)
            .text(0, 355, payslipTableTop + 60)
    );
    generateHrb(doc, payslipTableTop + 71);
    generateHrb(doc, payslipTableTop + 90);
    Line(doc)

    var EarningTop = payslipTableTop + 78;
    doc.font("Helvetica-Bold")
    generateEarningTableRow(
        doc,
        EarningTop,
        "Earning",
        "Amount",
        "Deductions",
        "Amount"
    );
    var Earning = EarningTop + 20;
    generateEarningTableRow(
        doc
            .font("Helvetica").fontSize(11)
            .text("Basic Salary", 50, Earning)
            .text(formatCurrency(41520), 315, Earning)
            .text("House Rent Allowance(HRA)", 50, Earning + 17)
            .text(formatCurrency(25254), 315, Earning + 17)
            .text("Medical Allowance", 50, Earning + 34)
            .text(formatCurrency(0), 160, Earning + 34, { align: "center" })
            .text("Leave Travel Allowance(LTA)", 50, Earning + 51)
            .text(formatCurrency(6920), 320, Earning + 51)

            .text("Professional Tax", 272, Earning, { align: "center" })
            .text(formatCurrency(200), 290, Earning, { align: "right" })
            .text("Income Tax", 250, Earning + 17, { align: "center" })
            .text(formatCurrency(0), 290, Earning + 17, { align: "right" })
            .text("Provident Fund", 268, Earning + 34, { align: "center" })
            .text(formatCurrency(1800), 290, Earning + 34, { align: "right" })
            .text("Personal loan", 260, Earning + 51, { align: "center" })
            .text(formatCurrency(0), 290, Earning + 54, { align: "right" })


    );
    generateHrb(doc, Earning + 65);
    generateHrb(doc, Earning + 81);
    Line(doc)

    var TotalBasicTop = Earning + 71;
    doc.font("Helvetica-Bold")
    generateTotalBasicTableRow(
        doc,
        TotalBasicTop,
        "Total Basic Salary",
        formatCurrency(69200),
        "Gross Deductions",
        formatCurrency(2000),
    );
    var Total = TotalBasicTop + 20;
    generateTotalBasicTableRow(
        doc
            .font("Helvetica").fontSize(11)
            .text("Mobile Reimbursement", 50, Total)
            .text(formatCurrency(0), 160, Total, { align: "center" })
            .text("Travelling Allowance", 50, Total + 23)
            .text(formatCurrency(3000), 140, Total + 23, { align: "center" })

    );
    generateHrb(doc, Total + 38);
    generateHrb(doc, Total + 53);
    Line(doc)

    var TotalSalaryTop = Total + 44;
    doc.font("Helvetica-Bold")
    generateTotalSalaryTableRow(
        doc,
        TotalSalaryTop,
        "Total Salary",
        formatCurrency(72200),
        "Total Deductions",
        formatCurrency(2000)
    );
    generateHrb(doc, TotalSalaryTop + 24);
    generateHrb(doc, TotalSalaryTop + 85);
    Line(doc)

    var NetSalaryTop = Total + 57
    generateFinalTotalTableRow(
        doc,
        NetSalaryTop,
        "Total Salary",
        formatCurrency(70200)
    );
    generateFinalTotalTableRow(
        doc
            .text("THIS IS COMPTUTER GENERATED SALARY SLIP. DOES NOT REQUIRED A SIGNATURE", 60, NetSalaryTop + 35)
    )
}

const generateTableRow = (doc, y, Attendence, Value, Playslip) => {
    doc
        .fontSize(9.5)
        .text(Attendence, 50, y, { width: 260, align: 'justified' })
        .text(Value, 270, y, { width: 90, align: "center" })
        .text(Playslip, 340, y, { width: 150, align: "center" })
}
const generateEarningTableRow = (doc, y, Earning, Amount, Deductions, amount) => {
    doc
        .fontSize(9.5)
        .text(Earning, 50, y, { width: 260, align: 'justified' })
        .text(Amount, 275, y, { width: 90, align: "center" })
        .text(Deductions, 320, y, { width: 150, align: "center" })
        .text(amount, 490, y, { align: "center" })

}
const generateTotalBasicTableRow = (doc, y, TotalBasic, Amount, Deductions, amount) => {
    doc
        .fontSize(11)
        .text(Amount, 293, y, { width: 90, align: "center" })
        .text(amount, 270, y, { align: "right" })
        .fontSize(9.5)
        .text(TotalBasic, 50, y, { width: 260, align: 'justified' })
        .text(Deductions, 335, y, { width: 150, align: "center" })

}
const generateTotalSalaryTableRow = (doc, y, TotalBasic, Amount, Deductions, amount) => {
    doc
        .fontSize(11)
        .text(Amount, 294, y, { width: 90, align: "center" })
        .text(amount, 270, y, { align: "right" })
        .fontSize(9.5)
        .text(TotalBasic, 50, y, { width: 260, align: 'justified' })
        .text(Deductions, 335, y, { width: 150, align: "center" })

}
const generateFinalTotalTableRow = (doc, y, FinalTotal, NetAmount) => {
    doc
        .fontSize(11)
        .text(FinalTotal, 150, y,)
        .text(NetAmount, 350, y, { align: "center" })

}
const generateHr = (doc, y) => {
    doc
        .strokeColor("#aaaaaa")
        .dash(1000, { space: 0 })
        .lineWidth(1)
        .moveTo(48, y)
        .lineTo(552, y)
        .stroke()
}

const Line = (doc) => {
    doc
        .strokeColor("#0f0f0f")
        .lineWidth(1)
        .moveTo(270, 285).lineTo(270, doc.y - 2)
        .lineWidth(1)
        .moveTo(365, 285).lineTo(365, doc.y + 13)
        .lineWidth(1)
        .moveTo(490, 365).lineTo(490, doc.y - 2)
        .lineWidth(1)
        .moveTo(552, 50).lineTo(552, doc.y + 74)
        .lineWidth(1)
        .moveTo(48, 50).lineTo(48, doc.y + 74)
        .stroke();
}

const generateHrb = (doc, y) => {
    doc
        .strokeColor("#0f0f0f")
        .lineWidth(1)
        .moveTo(48, y)
        .lineTo(552, y)
        .stroke();
}

const formatCurrency = (rupees) => {
    var Rupees = rupees.toFixed(2);
    Rupees = Rupees.toString();
    var lastThree = Rupees.substring(Rupees.length - 6);
    var otherNumbers = Rupees.substring(0, Rupees.length - 6);
    if (otherNumbers != '')
        lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

    return res;
}

const formatDate = (date) => {
    return moment(date).format('MMM DD, YYYY');
}

module.exports = {
    createPayslip
};