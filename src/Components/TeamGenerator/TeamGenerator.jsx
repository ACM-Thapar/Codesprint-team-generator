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
    let isUniform = false;
    let attempts = 0;
    let teams;

    while (!isUniform) {
      attempts++;
      teams = generateSingleSetOfTeams (members);
      isUniform = checkUniformDistribution (teams);
    }

    console.log ('Teams:', teams);
    console.log ('Is Distributed Uniformly:', isUniform);
    console.log ('Number of Attempts:', attempts);

    return teams;
  };

  const generateSingleSetOfTeams = members => {
    // Separate team leaders and regular members
    const leaders = members.filter (member => member.role === 'team leader');
    const regularMembers = members.filter (member => member.role === 'member');

    // Shuffle team leaders and regular members separately
    const shuffledLeaders = _.shuffle (leaders);
    const shuffledRegularMembers = _.shuffle (regularMembers);

    const teamSize = 3; // Change this to set the desired team size
    const numTeams = Math.ceil (members.length / teamSize);
    const teams = Array.from ({length: numTeams}, () => []);

    // Distribute team leaders across teams, ensuring one leader per team
    for (let i = 0; i < numTeams; i++) {
      if (shuffledLeaders.length > 0) {
        teams[i].push (shuffledLeaders.pop ());
      }
    }

    // Group regular members by department
    const regularMembersByDepartment = _.groupBy (
      shuffledRegularMembers,
      'department'
    );

    // Calculate the maximum number of members each department can have in a team
    const maxMembersPerDepartment = Math.floor (
      shuffledRegularMembers.length / numTeams
    );

    // Distribute regular members evenly across teams, considering the department of the team leader
    let teamIndex = 0;
    for (const department of Object.keys (regularMembersByDepartment)) {
      const departmentMembers = regularMembersByDepartment[department];
      while (departmentMembers.length > 0) {
        if (teams[teamIndex].length >= teamSize) {
          teamIndex = (teamIndex + 1) % numTeams;
        }

        const member = departmentMembers.pop ();
        teams[teamIndex].push (member);
        teamIndex = (teamIndex + 1) % numTeams;

        // To avoid adding too many members from the same department to a team
        if (
          teams[teamIndex].length < maxMembersPerDepartment &&
          departmentMembers.length === 0
        ) {
          break;
        }
      }
    }

    return teams;
  };

  const checkUniformDistribution = teams => {
    const departments = ['dev', 'designing', 'ml'];
    for (let i = 0; i < teams.length; i++) {
      const teamDepartments = teams[i].map (member => member.department);
      for (const department of departments) {
        if (!teamDepartments.includes (department)) {
          return false;
        }
      }
    }
    return true;
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
