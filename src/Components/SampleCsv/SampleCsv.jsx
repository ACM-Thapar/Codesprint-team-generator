import {Fragment} from 'react';
import Papa from 'papaparse';

const SampleCsv = () => {
  const handleDownloadSampleCSV = () => {
    const sampleData = [
      {name: 'member1', department: 'dev', role: 'team leader'},
      {name: 'member2', department: 'designing', role: 'team leader'},
      {name: 'member3', department: 'ml', role: 'team leader'},
      {name: 'member4', department: 'dev', role: 'team leader'},
      {name: 'member5', department: 'designing', role: 'member'},
      {name: 'member6', department: 'ml', role: 'member'},
      {name: 'member7', department: 'designing', role: 'member'},
      {name: 'member8', department: 'dev', role: 'member'},
      {name: 'member9', department: 'ml', role: 'member'},
      {name: 'member10', department: 'dev', role: 'member'},
      {name: 'member11', department: 'dev', role: 'member'},
      {name: 'member12', department: 'dev', role: 'member'},
      {name: 'member13', department: 'designing', role: 'member'},
      {name: 'member14', department: 'designing', role: 'member'},
      {name: 'member15', department: 'dev', role: 'member'},
      {name: 'member16', department: 'dev', role: 'member'},
      {name: 'member17', department: 'designing', role: 'member'},
      {name: 'member18', department: 'dev', role: 'member'},
      {name: 'member19', department: 'ml', role: 'member'},
      {name: 'member20', department: 'ml', role: 'member'},
    ];

    const csvContent = Papa.unparse (sampleData, {header: true});
    const blob = new Blob ([csvContent], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL (blob);
    const link = document.createElement ('a');
    link.setAttribute ('href', url);
    link.setAttribute ('download', 'sample.csv');
    document.body.appendChild (link);
    link.click ();
    document.body.removeChild (link);
  };

  return (
    <Fragment>
      <button onClick={handleDownloadSampleCSV}>Sample CSV</button>
    </Fragment>
  );
};
export default SampleCsv;
