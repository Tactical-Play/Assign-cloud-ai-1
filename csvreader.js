var fs = require('fs'); 
var { parse } = require('csv-parse');

var csvData=[];
fs.createReadStream('titanic.csv')
    .pipe(parse({delimiter: ':'}))
    .on('data', function(csvrow) {
        //console.log(csvrow);
        let arr = csvrow[0].split(',');
        csvData.push(arr);        
    })
    .on('end',function() {
      console.log(csvData.length);
      console.log(csvData[0]);
      //create object
      csvDict={};
      for(i in csvData[0]){
          let cls=csvData[0][i];
          let temp=[]
          for(j of csvData){
              temp.push(j[i]);
          }
          csvDict[cls]=temp;
      }
      //console.log(Object.keys(csvDict));
      // object created with keys as column headers of dataset and values as the array of values in that column
      //adding ticket column = class+fare+embark_town
      let temp=[];
      for(i in csvData){
          if(i==0)continue;
          temp.push('Ticket: '+csvDict['class'][i]+';Price: $ '+csvDict['fare'][i]+';Port: '+csvDict['embark_town'][i]);
      }
      csvDict['ticket']=temp;//ticket column added
      
      //Regex
      //1.pattern = decimal no. for ticket column
        const pat_1 = /[0-9.]+/gi;
        var res_1=[];//arr of matches
        for(ele of csvDict['ticket']){
            try{
            res_1.push(ele.match(pat_1)[0]);}
            catch{;}
        }
        console.log(csvDict['ticket'].slice(0,5));
        console.log(res_1.slice(0,5));// correct output received
        //2. pattern = (First|Second)
        const pat_2 = /First|Second/gi;
        //3.
        const pat_3 = /Ticket: First|Second/gi;
        //4.
        const pat_4 =/[0-9][0-9]/gi;
        //5.
        const pat_5 =/Ticket: [A-Z]/gi;
        //6.
        const pat_6=/T......../gi;
        //7.
        const pat_7=/Price: [^0-9A-Za-z] ../gi;
        //8.
        const pat_8=/[0-9][0-9]?.[0-9]*/gi;
        //9.
        const pat_9=/Ticket: [a-zA-Z]+/gi;
        //10.
        const pat_10=/[a-zA-Z]+tow?n/gi;
        //11.
        const pat_11=/([a-zA-Z]+[ :])/gi;
        //12.
        const pat_12=/\$ [0-9]+\.[0-9]+/gi;
        //Now to check
        var res_2=[],res_3=[],res_4=[],res_5=[],res_6=[],res_7=[],res_8=[],res_9=[],res_10=[],res_11=[],res_12=[];
        for(ele of csvDict['ticket']){
            try{
            res_2.push(ele.match(pat_2)[0]);
            res_3.push(ele.match(pat_3)[0]);
            res_4.push(ele.match(pat_4)[0]);
            res_5.push(ele.match(pat_5)[0]);
            res_6.push(ele.match(pat_6)[0]);
            res_7.push(ele.match(pat_7)[0]);
            res_8.push(ele.match(pat_8)[0]);
            res_9.push(ele.match(pat_9)[0]);
            res_10.push(ele.match(pat_10)[0]);
            res_11.push(ele.match(pat_11));
            res_12.push(ele.match(pat_12)[0]);
        }
            catch{;}
        }
        //check results using first five entries
        console.log('first|second\n',res_2.slice(0,5));
        console.log('ticket:first|second\n',res_3.slice(0,5));
        console.log('2dig no.\n',res_4.slice(0,5));
        console.log('Ticket: lettr\n',res_5.slice(0,5));
        console.log('T.........\n',res_6.slice(0,5));
        console.log('Price: [^0-9A-Za-z]..\n',res_7.slice(0,5));
        console.log('[0-9][0-9]?.[0-9]*\n',res_8.slice(0,5));
        console.log('Ticket: [a-zA-Z]+\n',res_9.slice(0,5));
        console.log('[a-zA-Z]+tow?n\n',res_10.slice(0,5));
        console.log('All words\n',res_11.slice(0,5));
        console.log('USD price\n',res_12.slice(0,5));

    });