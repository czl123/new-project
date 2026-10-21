import ExcelJS from 'exceljs';
import { exportComboListToExcel, parseComboExcelFile } from '../src/utils/combo-excel-template.ts';

async function testExport21() {
  console.log('Generating 21 items...');
  const items = [];
  for (let i = 1; i <= 21; i++) {
    items.push({
      parentCode: `CB-B02*${i}-PBMGL-HK-3`,
      productName: `组合柜测试款${i}`,
      comboType: '多件打包',
      style: 'AuraB01',
      material: '实木+板材',
      brand: '中性',
      color: '原木色',
      packQty: '2pack',
      boundChildren: [
        { childCode: `IF26021${i}`, childName: `子部件A${i}`, ratio: 1 },
        { childCode: `IF26022${i}`, childName: `子部件B${i}`, ratio: 2 }
      ]
    });
  }

  console.log('Exporting 21 items to excel...');
  const blob = await exportComboListToExcel(items);
  const buffer = await blob.arrayBuffer();
  console.log('Exported blob size:', buffer.byteLength);

  console.log('Parsing exported 21 items...');
  const start = Date.now();
  const parsed = await parseComboExcelFile(buffer, '待提交');
  console.log('Parsed successfully in', Date.now() - start, 'ms! Items:', parsed.length);
}

testExport21().catch(console.error);
