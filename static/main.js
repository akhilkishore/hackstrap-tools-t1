$(document).ready(function(){

    function modal(){
        $('.modal').modal('show');
        console.log('overlay starting..');
        
    }

    function convertArrayOfObjectsToCSV(args) {  
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }


    function downloadCSV(items) {  
        var data, filename, link;
        var csv = convertArrayOfObjectsToCSV({
            data: items
        });

        if (csv == null) return;
        filename = 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.getElementById('asd');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();

    }

    function stripUsername(text){
        //text = text.replace(" ","");
        temp = "";
        temp += text[text.length-1];
        for(x=text.length-2;x>0;x--){
            if(text[x] == "/") {
                break;
            }else{
                temp += text[x];
            }
        }
        temp = reverseString(temp);
        temp = temp.replace("/","");
        return temp;
    }
    function reverseString(str) {
        return str.split("").reverse().join("");
    }

 
    $("#LUPS_btn").click(function(){
        var data = $('#LUPS_text').val();
        if(data.length > 5){
            all_id = [];
            data = data.split("\n");
            for(var y=0;y<data.length;y++){
                img = stripUsername(data[y]);
                all_id.push(img);
            }
            //downloadCSV({ filename: "stock-data.csv" });
            sub = {"data": all_id};
            modal();
            $.ajax({
                url: "/userScrap",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(sub)
              }).done(function(data) {
                    $('.modal').modal('hide');
                    new_data = []
                    //name headline industry skills location summary
                    new_data.push(["ID", "Name", "Headline", "Industry", "Location", "Summary"])
                    for(var x = 0; x< data.length;x++){
                        new_data.push(data[x]);
                    }
                    downloadCSV(new_data);
              });


        }else{
            alert("no data");
        }

    });


})