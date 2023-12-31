import {useState} from 'react';
import Papa from 'papaparse';
import _ from 'lodash';
import SampleCsv from '../SampleCsv/SampleCsv';

const TeamGenerator = () => {
  const [teams, setTeams] = useState ([]);
  const [error, setError] = useState (null);

  const handleFileChange = e => {
    const file = e.target.files[0];
    Papa.parse (file, {
      complete: handleCsvParsed,
      header: true,
    });
  };

  const handleCsvParsed = result => {
    const requiredColumns = ['name', 'department', 'role'];
    const csvColumns = result.meta.fields.map (col =>
      col.toLowerCase ().trim ()
    );
    const isValidCsv = requiredColumns.every (col => csvColumns.includes (col));

    if (!isValidCsv) {
      setError (
        'Invalid CSV file. Please make sure it contains columns: name, department, role.'
      );
      return;
    }

    const data = result.data.filter (item =>
      Object.values (item).every (
        value => value !== undefined && value !== null && value.trim () !== ''
      )
    );
    console.log ('Data after filtering:', data);

    const parsedData = data.map (item => ({
      name: item.name.trim (),
      department: item.department.trim (),
      role: item.role.trim (),
    }));

    setError (null);

    console.log ('Parsed data:', parsedData);

    const numTeams = countTeamLeaders (parsedData);

    if (numTeams === 0) {
      setError ('No team leaders found in the CSV data.');
      setTeams ([]);
      return;
    }

    const calculatedTeamSize = Math.ceil (parsedData.length / numTeams);

    if (calculatedTeamSize <= 0) {
      setError ('Unable to determine a valid team size with the given data.');
      setTeams ([]);
      return;
    }

    const teams = generateTeams (parsedData, calculatedTeamSize);
    console.log ('Generated teams:', teams);
    setTeams (teams);
  };

  const generateTeams = (members, size) => {
    let isUniform = false;
    let attempts = 0;
    let teams;

    while (!isUniform) {
      attempts++;
      teams = generateSingleSetOfTeams (members, size);
      isUniform = checkUniformDistribution (teams);
    }

    console.log ('Teams:', teams);
    console.log ('Is Distributed Uniformly:', isUniform);
    console.log ('Number of Attempts:', attempts);

    return teams;
  };

  const countTeamLeaders = members => {
    return members.filter (member => member.role === 'team leader').length;
  };

  const generateSingleSetOfTeams = (members, size) => {
    const leaders = members.filter (member => member.role === 'team leader');
    const regularMembers = members.filter (member => member.role === 'member');

    const shuffledLeaders = _.shuffle (leaders);
    const shuffledRegularMembers = _.shuffle (regularMembers);

    const numTeams = Math.ceil (members.length / size);
    const teams = Array.from ({length: numTeams}, () => []);

    for (let i = 0; i < numTeams; i++) {
      if (shuffledLeaders.length > 0) {
        teams[i].push (shuffledLeaders.pop ());
      }
    }

    const regularMembersByDepartment = _.groupBy (
      shuffledRegularMembers,
      'department'
    );

    const maxMembersPerDepartment = Math.floor (
      shuffledRegularMembers.length / numTeams
    );

    let teamIndex = 0;
    for (const department of Object.keys (regularMembersByDepartment)) {
      const departmentMembers = regularMembersByDepartment[department];
      while (departmentMembers.length > 0) {
        if (teams[teamIndex].length >= size) {
          teamIndex = (teamIndex + 1) % numTeams;
        }

        const member = departmentMembers.pop ();
        teams[teamIndex].push (member);
        teamIndex = (teamIndex + 1) % numTeams;

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
      <SampleCsv />
      {error && <div style={{color: 'red'}}>{error}</div>}
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
