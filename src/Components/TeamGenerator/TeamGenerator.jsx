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
    const csvColumns = result.meta.fields.map (col =>
      col.toLowerCase ().trim ()
    );
    const isValidCsv = requiredColumns.every (col => csvColumns.includes (col));

    if (!isValidCsv) {
      alert (
        'Invalid CSV file. Please make sure it contains columns: name, department, role.'
      );
      return;
    }

    // Parse the CSV data to JSON and filter out invalid rows
    const data = result.data.filter (item =>
      Object.values (item).every (
        value => value !== undefined && value !== null && value.trim () !== ''
      )
    );
    console.log ('Data after filtering:', data); // Debugging

    const parsedData = data.map (item => ({
      name: item.name.trim (),
      department: item.department.trim (),
      role: item.role.trim (),
    }));
    console.log ('Parsed data:', parsedData); // Debugging

    // Generate teams
    const teams = generateTeams (parsedData);
    console.log ('Generated teams:', teams); // Debugging
    setTeams (teams);
  };

  const generateTeams = members => {
    // Separate team leaders and regular members
    const leaders = members.filter (member => member.role === 'team leader');
    const regularMembers = members.filter (member => member.role === 'member');

    // Shuffle team leaders and regular members
    const shuffledLeaders = _.shuffle (leaders);
    const shuffledRegularMembers = _.shuffle (regularMembers);

    const teamSize = 3; // Change this to set the desired team size
    const numTeams = Math.ceil (members.length / teamSize);
    const teams = Array.from ({length: numTeams}, () => []);
    let currentIndex = 0;

    // Assign team leaders to each team
    shuffledLeaders.forEach (leader => {
      teams[currentIndex].push (leader);
      currentIndex = (currentIndex + 1) % numTeams;
    });

    // Distribute regular members evenly across teams
    shuffledRegularMembers.forEach (member => {
      if (teams[currentIndex].length >= teamSize) {
        currentIndex = (currentIndex + 1) % numTeams;
      }
      teams[currentIndex].push (member);
      currentIndex = (currentIndex + 1) % numTeams;
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
