function convertArrayOfObjectsToCSV(args) {
  var result, ctr, keys, columnDelimiter, lineDelimiter, data;

  data = args.data || null;
  keys = args.header || Object.keys(data[0]);

  if (keys == null || !keys.length) {
    return null;
  }

  columnDelimiter = args.columnDelimiter || ",";
  lineDelimiter = args.lineDelimiter || "\n";

  result = "";
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  if (data !== null && data.length) {
    data.forEach(function(item) {
      ctr = 0;
      keys.forEach(function(key) {
        if (ctr > 0) result += columnDelimiter;

        result += item[key] || "";
        ctr++;
      });
      result += lineDelimiter;
    });
  }

  return result;
}

export function downloadCsv(args) {
  var data, filename, link;

  var csv = convertArrayOfObjectsToCSV({
    data: args.data,
    header: args.header
  });
  if (csv == null) return;

  filename = args.filename || "export.csv";

  // if (!csv.match(/^data:text\/csv/i)) {
  //   csv = "data:text/csv;charset=utf-8," + csv;
  // }
  data = encodeURI(csv);
  let csvData = new Blob([csv], { type: "text/csv" });
  var csvUrl = URL.createObjectURL(csvData);

  link = document.createElement("a");
  link.setAttribute("href", csvUrl);
  link.setAttribute("download", filename);
  link.click();
}
