import ExcelJS from 'exceljs';
import { generateStyledComboTemplateExcel, parseComboExcelFile } from '../src/utils/combo-excel-template.ts';

async function testFull() {
  console.log('Generating template...');
  const blob = await generateStyledComboTemplateExcel();
  const buffer = await blob.arrayBuffer();
  console.log('Blob generated, size:', buffer.byteLength);
  
  console.log('Parsing template...');
  const start = Date.now();
  const parsed = await parseComboExcelFile(buffer, '待提交');
  console.log('Parsed successfully in', Date.now() - start, 'ms! Items:', parsed.length);
}

testFull().catch(console.error);
