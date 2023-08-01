import {useState} from 'react';
import Papa from 'papaparse';
import _ from 'lodash';

const TeamGenerator = () => {
  const [teams, setTeams] = useState ([]);

  const handleFileChange = e => {
    const file = e.target.files[0];
    Papa.parse (file, {
      complete: handleCsvParsed,
      header: true,
    });
  };

  const handleCsvParsed = result => {
    // Check if the CSV contains the required columns
    const requiredColumns = ['name', 'department', 'role'];
    const csvColumns = result.meta.fields;
    const isValidCsv = requiredColumns.every (col => csvColumns.includes (col));

    if (!isValidCsv) {
      alert (
        'Invalid CSV file. Please make sure it contains columns: name, department, role.'
      );
      return;
    }

    // Parse the CSV data to JSON
    const data = result.data;
    const parsedData = data.map (item => ({
      name: item.name,
      department: item.department,
      role: item.role,
    }));

    // Generate teams
    const teams = generateTeams (parsedData);
    setTeams (teams);
  };

  const generateTeams = members => {
    const shuffledMembers = _.shuffle (members);
    const teamSize = 3; // Change this to set the desired team size
    const teams = _.chunk (shuffledMembers, teamSize);

    teams.forEach (team => {
      let hasLeader = false;
      team.forEach (member => {
        if (member.role === 'team leader' && !hasLeader) {
          hasLeader = true;
        } else {
          member.role = 'member';
        }
      });
    });

    return teams;
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {teams.map ((team, index) => (
        <div key={index}>
          <h2>Team {index + 1}</h2>
          <ul>
            {team.map ((member, i) => (
              <li key={i}>
                {member.name} - {member.department} ({member.role})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TeamGenerator;
