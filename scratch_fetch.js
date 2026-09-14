import axios from 'axios';
import fs from 'fs';

async function fetchLingxingData() {
  const url = 'https://jcbsc.lingxing.com/api/module/product/product.view/bundledLists?input_search=&search_field=sku&product_type[]=4&sort_field=create_time&sort_type=desc&search_value=&senior_search_list=[]&length=20&selected_product_ids=&req_time_sequence=%2Fapi%2Fmodule%2Fproduct%2Fproduct.view%2FbundledLists$$2';
  
  const headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9,en-GB;q=0.8,en-US;q=0.7,en;q=0.6',
    'Ak-Client-Type': 'web',
    'Ak-Origin': 'https://jcbsc.lingxing.com',
    'Auth-Token': '925eRPO2rWt/Z9eH8arpLIqwOhkasYuDqkZ9m46dA6l8TwH6EcBoAfE4FqOo/mk7n0nECldr3OvKRx8lqp8NfmDZ2nqrfScXKutyW6TPprWLZey0v1MwZyyj+GaEqU1msvKct06SeLCdg',
    'Origin': 'https://jcbsc.lingxing.com',
    'Referer': 'https://jcbsc.lingxing.com/',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin'
  };

  try {
    console.log('Sending request to Lingxing Web API with complete headers...');
    const response = await axios.get(url, { headers });
    console.log('Response status:', response.status);
    console.log('Response msg:', response.data?.msg);
    console.log('Response code:', response.data?.code);
    
    fs.writeFileSync('f:/project/jcerp/new-project/src/api/lingxing_bundled_data.json', JSON.stringify(response.data, null, 2), 'utf8');
    console.log('Successfully saved to f:/project/jcerp/new-project/src/api/lingxing_bundled_data.json');
  } catch (error) {
    console.error('Error fetching Lingxing data:', error.message);
  }
}

fetchLingxingData();
