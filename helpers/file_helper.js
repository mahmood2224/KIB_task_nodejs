const path = require('path');
const fs = require('fs');

//this function validate the file returning array of problems found
function validateFile(filePath) {
    let notValidReasons = [] ;

    //first check is if the ext is csv or not if not it returning directly
    if(path.extname(filePath) !== ".csv"){
        notValidReasons.push("the File is not CSV");
        return  notValidReasons;
    }

    let content = fs.readFileSync(filePath);
    let lines = content.toString().split('\n')

    //second check if the number of rows lower than the min or more than the max
    if(lines < 1 || lines > Math.pow(10 , 4)){
        notValidReasons.push("this file is empty or have more than 10000 row");
    }

    return notValidReasons;
}


function separateData(file) {
    //reading the file from the path
    let content = fs.readFileSync(file.path);
    //getting each line of the file
    let lines = content.toString().split('\r\n');
    //init maps to store data in
    let brandOrders =  new Map() ;
    let productQty =  new Map() ;
    //get total number of orders the same as number of lines
    let totalNumber = lines.length ;

    //now we will for each all orders in the file
    for(let line of lines){
        //in this line we split the line to get cells data as array
        let lineSplit = line.split(",");
        //now we path these data to this function this function should return data like { product : name , brand :brand_name }
        let brandProduct = getBrandOrders(lineSplit) ;
        //and we path the same line to other function that should return data like { product : name , qty : 8 }
        let productQtyObject = getProductQty(lineSplit) ;

        //in this line we update our map to accept the product and the brand togther as key and increase it's qty in each line
        //to get number of orders for each product brand the data stored like [{product,brand => 8},{product,brand => 8}]
        brandOrders.set(brandProduct.product+","+brandProduct.brand , (brandOrders?.get(brandProduct.product+","+brandProduct.brand)??0)+1) ;

        //in this line of code we get the data from the function and update the map to set product as key and update the qty of all orders
        //we make this to make it easy to calculate the avg when saving data
        productQty.set(productQtyObject.product , Number((productQty?.get(productQtyObject.product)??0)) + Number(productQtyObject.qty))
    }
    //this two lines just for sorting data
    const brandOrdersSorted = new Map([...brandOrders.entries()].sort((a, b) => b[1] - a[1]));
    const productQtySorted = new Map([...productQty.entries()].sort((a, b) => b[1] - a[1]));

    //clear old results to make new one
    clearResultFolder();
    //these two functions just creating files from the data sent to them
    let file_0_path =  createAFileForBrandOrder(brandOrdersSorted , file.originalFilename);
     let file_1_path = createAFileForProductAvg(productQtySorted , file.originalFilename , totalNumber);

     //return the paths to the result files
     return [file_0_path , file_1_path];
}



function getBrandOrders(lineSplit){
    //extracting data from the line and add return it as an object of { product : name , brand :brand_name }
    return {brand : lineSplit[4] , product : lineSplit[2] };
}

function getProductQty(lineSplit){
    //extracting data from the line and add return it as an object of { product : name , qty : 8 }
    return { product : lineSplit[2] , qty : lineSplit[3]}
}



function createAFileForBrandOrder(brandOrderSorted , originalName) {
    //init file content variable
    let content = "" ;
    //init array to save the product names to avoid repeating them we just take the top one because the data is sorted earlier
    let previousValues = [] ;
    brandOrderSorted.forEach( (key ,value)=>{
        //checking if the first term of the value (product_name) is stored before or not
        if(previousValues.indexOf(value.split(',')[0]) === -1 ) {
            //if not we store it in the array
            previousValues.push(value.split(',')[0])
            //then append it to the content
            content += value + "\r\n"
        }
    })
    //after finishing we write the content in the file with name desitred 1_ORIGINAL_NAME
    fs.writeFileSync("./public/results/1_"+originalName , content);
    return "results/1_"+originalName;
}

function createAFileForProductAvg(productQty , originalName , totalNumber) {
    //init file content variable
    let content = "" ;
    productQty.forEach( (key ,value)=>{
        //appending data to content variable after getting avg of qty
        content += value +","+makeAvg(totalNumber , key)+"\r\n"
    })
    //after finishing we write the content in the file with name desitred 0_ORIGINAL_NAME
    fs.writeFileSync("./public/results/0_"+originalName , content);
    return "results/0_"+originalName;
}

function makeAvg(totalNumber , qty) {
    //just return avg
    return qty/totalNumber;
}

function clearResultFolder(){
    fs.rmdirSync("./public/results",{ recursive: true }) ;
    fs.mkdirSync("./public/results");
}



module.exports ={
    validateFile :validateFile,
    separateData :separateData,
    getProductQty : getProductQty,
    getBrandOrders :getBrandOrders,
    makeAvg :makeAvg,

}