import _ from 'lodash';
import moment from 'moment';
import fs from "fs";
import PDFDocument from "pdfkit";


const createInvoice = (invoice, path) => {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc, invoice);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  // generateFooter(doc);
  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

const getCalculatedTotal = (invoice, type) => {
  const items = _.get(invoice, "items", [])
  let value = 0;
  items.map((data) => {
    value = type === 'gst' ? parseInt(value) + parseInt(data.rate * data.qty * 18 / 100) : parseInt(value) + parseInt(data.rate * data.qty);
  });

  return value;
}

const generateHeader = (doc, invoice) => {
  const gst = getCalculatedTotal(invoice, "gst");
  const subTotal = getCalculatedTotal(invoice, "gstsubtotal");

  doc
    .image("DevlatsLogo.png", 50, 60, { width: 100, height: 25 })
    .font("Courier-Bold").fontSize(8)
    .font("Helvetica-Bold").fontSize(15)
    .fillColor("#1b6272")
    .text("DEVLATS Private Limited", 190, 57)
    .fillColor("#444444")
    .font("Helvetica-Bold").fontSize(9)
    .text("GST-36BDTPD8418E1ZD", 200, 50, { align: "right" })
    .text("DATE", 200, 83, { align: "right" })
    .text("DUE", 200, 114, { align: "right" })
    .text("BALANCE DUE", 200, 143, { align: "right" }).font("Helvetica").fontSize(9.5)
    .text("armoor", 190, 80)
    .text("ss complex", 190, 95)
    .text("503224", 190, 110)
    .text("94929494", 190, 125)
    .text("hr@devlats.com", 190, 140)
    .text("INV0001", 200, 65, { align: "right" })
    .text(formatDate(new Date()), 200, 97, { align: "right" })
    .text("No Reciept", 200, 127, { align: "right" }).font("Helvetica").fontSize(10)
    .text("INR " + formatCurrency(subTotal + gst), 200, 158, { align: "right" })
    .moveDown();

}

const generateCustomerInformation = (doc, invoice) => {

  generateHr(doc, 185);
  const firstName = _.get(invoice, 'dataValues.first_name', "");
  const address = _.get(invoice, 'dataValues.address', "");
  const phone = _.get(invoice, 'dataValues.phone', "");

  const customerInformationTop = 200;

  doc
    .fontSize(9.5)
    .text("BILL TO", 50, customerInformationTop)
    .font("Courier-Bold").fontSize(12).fillColor("#4b4b4c")
    .text(firstName, 50, customerInformationTop + 18)
    .font("Helvetica").fontSize(10).fillColor("#444444")
    .text(address, 50, customerInformationTop + 39)
    .text(110011, 50, customerInformationTop + 54)
    .text(phone, 50, customerInformationTop + 69)
    .text("abc@gmail.com", 50, customerInformationTop + 83)
    .moveDown();

  generateHrb(doc, 318);
}

const generateInvoiceTable = (doc, invoice) => {

  let i;
  let index = 1;
  let invoiceTableTop = 328;
  let Quantity = 0;
  let position = 0;
  let note = "good one after purchasing this product you this product you this product you this product you"
  doc.font("Helvetica-Bold").fillColor("#1b6272");
  generateTableRow(
    doc,
    invoiceTableTop,
    "DESCRIPTION",
    "RATE",
    "QTY",
    "AMOUNT"
  );

  generateHrb(doc, invoiceTableTop + 18);
  doc.font("Helvetica").fontSize(10).fillColor("#444444");
  const gst = getCalculatedTotal(invoice, "gst");
  const subTotal = getCalculatedTotal(invoice, "gstsubtotal");

  const items = _.get(invoice, "items", [])
  for (i = 0; i < items.length; i++) {
    const item = items[i];
    Quantity = parseInt(Quantity) + parseInt(item.qty);
    position = invoiceTableTop + index * 30;
    index++;
    if (position >= 700) {
      index = 0;
      invoiceTableTop = 50;
      doc.addPage();
      if (position >= 700) {
        position = 20
      }
    }
    generateTableRow(
      doc,
      position,
      `${item.description}.${note}`,
      formatCurrency(item.rate),
      item.qty,
      formatCurrency(item.rate * item.qty),
    );

    generateDashLine(doc, position + 23)
  }

  var GstChargesPosition = position + 30;

  if (GstChargesPosition > 740) {
    doc.addPage();
    GstChargesPosition = 80;
  }
  generateTableRow(
    doc
      .fontSize(9)
      .font("Helvetica")
      .text("GST Charges 18%", 50, GstChargesPosition + 2)
      .text(formatCurrency(gst), 280, GstChargesPosition + 2, { width: 90, align: "right" })
      .text(Quantity, 350, GstChargesPosition + 2, { width: 90, align: "right" })
      .text(formatCurrency(gst), 0, GstChargesPosition + 2, { align: "right" })
  )
  generateHr(doc, GstChargesPosition + 20);

  const bankDetails = _.get(invoice, 'dataValues.account_details', {})

  var accountDetailsPosition = GstChargesPosition + 28;

  if (accountDetailsPosition > 700) {
    doc.addPage();
    accountDetailsPosition = 80;
  }
  generateTableRow(
    doc
      .fontSize(10)
      .font("Helvetica-Bold").fillColor("#1b6272")
      .text("Bank Details", 50, accountDetailsPosition + 2)
      .font("Helvetica").fillColor("#444444")
      .text("Bank Name :", 50, accountDetailsPosition + 16)
      .text(bankDetails.bank_name, 110, accountDetailsPosition + 16)
      .text("Accont No :", 50, accountDetailsPosition + 29)
      .text(bankDetails.account_no, 110, accountDetailsPosition + 29)
      .text("IFSC Code :", 50, accountDetailsPosition + 42)
      .text(bankDetails.IFSC, 110, accountDetailsPosition + 42)
  )
  generateHr(doc, accountDetailsPosition + 60);

  var subtotalPosition = accountDetailsPosition + 67
  if (subtotalPosition > 700) {
    doc.addPage();
    subtotalPosition = 80;
  }

  generateTableRow(
    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .text("SUBTOTAL ", 160, subtotalPosition, { align: "center" })
      .text("TAX(0%) ", 150, subtotalPosition + 17, { align: "center" })
      .font("Helvetica")
      .fontSize(10)
      .text(formatCurrency(subTotal + gst), 200, subtotalPosition, { align: "right" })
      .text(formatCurrency(0), 200, subtotalPosition + 15, { align: "right" }),
  )
  generateHrShort(doc, subtotalPosition + 35)

  var Total = subtotalPosition + 43;
  if (Total > 700) {
    doc.addPage();
    Total = 130;
  }
  generateTableRow(
    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .text("TOTAL ", 146, Total, { align: "center" })
      .font("Helvetica")
      .fontSize(10)
      .text(formatCurrency(subTotal + gst), 200, Total, { align: "right" }),
  )

  generateHrShort(doc, Total + 15)

  var duePosition = Total + 25;
  if (duePosition > 700) {
    doc.addPage();
    duePosition = 130;
  }

  generateTableRow(
    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .text("BALANCE", 160, duePosition, { align: "center" })
      .text("DUE", 135, duePosition + 10, { align: "center" })
      .fontSize(12).fillColor("#1b6272")
      .text("INR " + formatCurrency(subTotal + gst), 200, duePosition + 3, { align: "right" })
  )
  generateHrShort(doc, duePosition + 25);
  generateHrShort(doc, duePosition + 27);

}

const generateTableRow = (doc, y, description, rate, qty, amount) => {
  doc
    .fontSize(9.5)
    .text(description, 50, y, { width: 260, align: 'justified' })
    .text(rate, 280, y, { width: 90, align: "right" })
    .text(qty, 350, y, { width: 90, align: "right" })
    .text(amount, 0, y, { align: "right" });
}

const generateHr = (doc, y) => {
  doc
    .strokeColor("#aaaaaa")
    .dash(1000, { space: 0 })
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke()
}

const generateDashLine = (doc, y) => {
  doc
    .strokeColor("#aaaaaa")
    .dash(3, { space: 3 })
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke()
}

const generateHrShort = (doc, y) => {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .dash(1000, { space: 0 })
    .moveTo(325, y)
    .lineTo(550, y)
    .stroke()
}

const generateHrb = (doc, y) => {
  doc
    .strokeColor("#0f0f0f")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
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

  return `Rs. ${res}`;
}

const formatDate = (date) => {
  return moment(date).format('MMM DD, YYYY');
}

module.exports = {
  createInvoice
};