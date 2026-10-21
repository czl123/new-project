import ExcelJS from 'exceljs';
import fs from 'fs';

// Let's test creating a workbook like generateStyledComboTemplateExcel does, and then parsing it.
async function test() {
  console.log('Testing ExcelJS create and parse...');
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('组合物料导入数据录入');
  
  // add columns
  ws.getRow(4).values = ['', '* 子物料编码', '* 单套配比', '* 组合类型', '* 销售平台', '* 运营大类', '* 产品名称'];
  
  // add 21 rows
  for (let i = 1; i <= 21; i++) {
    ws.getRow(4 + i).values = ['', `IF00${i}`, '1', '多件打包', 'Amazon', '家具', `测试产品${i}`];
  }
  
  const buffer = await wb.xlsx.writeBuffer();
  console.log('Buffer size:', buffer.byteLength);
  
  // Now parse it
  const wb2 = new ExcelJS.Workbook();
  await wb2.xlsx.load(buffer);
  const ws2 = wb2.worksheets[0];
  console.log('Worksheet rowCount:', ws2.rowCount);
  console.log('Done test');
}

test().catch(console.error);
