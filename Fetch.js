import axios from "axios"
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const getSalesNoteBook = async () => {
  const options = {
		method: 'GET',
		url: 'https://elalfaylaomega.com/credit-customer/jsonapi/node/sales_notebook',
	};
      
	return await axios.request(options).then(function (response) {
	 let totalSales = []
	    response.data.data.forEach((data)=> {
		 const dataSales =  {
			date: data.attributes.field_sales_date,
			total: data.attributes.field_sales_total
		}
		totalSales.push(dataSales)
	})
   
	return totalSales

	}).catch(function (error) {
		console.error(error);
	});
}


export {getSalesNoteBook}

//sales_notebook