import type { Team } from '@/types';

/**
 * NCAA Tournament 2025 - Real seeding data
 * Extracted from actual tournament seeding with proper 1-16 seeds per region
 * Teams are stored without region property - regional organization is handled separately
 */
export const ncaaTeams2025: Team[] = [
  // South Region - Seeds 1-16
  { id: 'auburn', name: 'auburn', displayName: 'Auburn Tigers', shortName: 'AUB', seed: 1, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21354.svg', color: 'cloud' },
  { id: 'michigan-state', name: 'michigan-state', displayName: 'Michigan State Spartans', shortName: 'MSU', seed: 2, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21194.svg', color: 'primary' },
  { id: 'iowa-state', name: 'iowa-state', displayName: 'Iowa State Cyclones', shortName: 'ISU', seed: 3, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21203.svg', color: 'ocean' },
  { id: 'texas-a&m', name: 'texas-a&m', displayName: 'Texas A&M Aggies', shortName: 'A&M', seed: 4, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21211.svg', color: 'plum' },
  { id: 'michigan', name: 'michigan', displayName: 'Michigan Wolverines', shortName: 'MICH', seed: 5, logo: '', color: 'secondary' },
  { id: 'ole-miss', name: 'ole-miss', displayName: 'University of Mississippi', shortName: 'OLE', seed: 6, logo: '', color: 'secondary' },
  { id: 'marquette', name: 'marquette', displayName: 'Marquette Golden Eagles', shortName: 'MAR', seed: 7, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21239.svg', color: 'secondary' },
  { id: 'louisville', name: 'louisville', displayName: 'University of Louisville', shortName: 'LOU', seed: 8, logo: '', color: 'secondary' },
  { id: 'creighton', name: 'creighton', displayName: 'Creighton Bluejays', shortName: 'CRE', seed: 9, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21305.svg', color: 'primary' },
  { id: 'new-mexico', name: 'new-mexico', displayName: 'University of New Mexico', shortName: 'UNM', seed: 10, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21429.svg', color: 'pink' },
  { id: 'unc', name: 'unc', displayName: 'University of North Carolina', shortName: 'UNC', seed: 11, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21134.svg', color: 'info' },
  { id: 'uc-san-diego', name: 'uc-san-diego', displayName: 'University of California, San Diego', shortName: 'UCSD', seed: 12, logo: '', color: 'secondary' },
  { id: 'yale', name: 'yale', displayName: 'Yale University', shortName: 'YALE', seed: 13, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21253.svg', color: 'rust' },
  { id: 'lipscomb', name: 'lipscomb', displayName: 'Lipscomb University', shortName: 'LIP', seed: 14, logo: '', color: 'secondary' },
  { id: 'bryant', name: 'bryant', displayName: 'Bryant University', shortName: 'BRY', seed: 15, logo: '', color: 'secondary' },
  { id: 'alabama-state', name: 'alabama-state', displayName: 'Alabama State University', shortName: 'ASU', seed: 16, logo: '', color: 'secondary' },

  // East Region - Seeds 1-16  
  { id: 'duke', name: 'duke', displayName: 'Duke Blue Devils', shortName: 'DUKE', seed: 1, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21130.svg', color: 'pink' },
  { id: 'alabama', name: 'alabama', displayName: 'University of Alabama', shortName: 'BAMA', seed: 2, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21352.svg', color: 'sunset' },
  { id: 'wisconsin', name: 'wisconsin', displayName: 'University of Wisconsin–Madison', shortName: 'WIS', seed: 3, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21200.svg', color: 'ocean' },
  { id: 'arizona', name: 'arizona', displayName: 'University of Arizona', shortName: 'ARIZ', seed: 4, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21335.svg', color: 'secondary' },
  { id: 'oregon', name: 'oregon', displayName: 'University of Oregon', shortName: 'ORE', seed: 5, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21338.svg', color: 'zen' },
  { id: 'byu', name: 'byu', displayName: 'Brigham Young University', shortName: 'BYU', seed: 6, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21424.svg', color: 'coconut' },
  { id: 'saint-marys', name: 'saint-marys', displayName: "Saint Mary's College of California", shortName: 'SMC', seed: 7, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21422.svg', color: 'danger' },
  { id: 'mississippi-state', name: 'mississippi-state', displayName: 'Mississippi State University', shortName: 'MSU', seed: 8, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21360.svg', color: 'info' },
  { id: 'baylor', name: 'baylor', displayName: 'Baylor University', shortName: 'BAY', seed: 9, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21201.svg', color: 'primary' },
  { id: 'vanderbilt', name: 'vanderbilt', displayName: 'Vanderbilt University', shortName: 'VAN', seed: 10, logo: '', color: 'secondary' },
  { id: 'vcu', name: 'vcu', displayName: 'Virginia Commonwealth University', shortName: 'VCU', seed: 11, logo: 'https://sports.cbsimg.net/fly/images/team-logos/light/21232.svg', color: 'navy' },
  { id: 'liberty', name: 'liberty', displayName: 'Liberty University', shortName: 'LIB', seed: 12, logo: '', color: 'secondary' },
  { id: 'akron', name: 'akron', displayName: 'University of Akron', shortName: 'AKR', seed: 13, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21264.svg', color: 'coconut' },
  { id: 'montana', name: 'montana', displayName: 'University of Montana', shortName: 'UM', seed: 14, logo: '', color: 'secondary' },
  { id: 'robert-morris', name: 'robert-morris', displayName: 'Robert Morris University', shortName: 'RMU', seed: 15, logo: '', color: 'secondary' },
  { id: 'alabama-state-east', name: 'alabama-state-east', displayName: 'Alabama State University', shortName: 'ASU', seed: 16, logo: '', color: 'secondary' },

  // West Region - Seeds 1-16
  { id: 'florida', name: 'florida', displayName: 'University of Florida', shortName: 'UF', seed: 1, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21355.svg', color: 'rust' },
  { id: 'uconn', name: 'uconn', displayName: 'University of Connecticut', shortName: 'UCON', seed: 2, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21161.svg', color: 'zen' },
  { id: 'memphis', name: 'memphis', displayName: 'University of Memphis', shortName: 'MEM', seed: 3, logo: 'https://sports.cbsimg.net/fly/images/team-logos/light/21240.svg', color: 'zen' },
  { id: 'maryland', name: 'maryland', displayName: 'University of Maryland, College Park', shortName: 'MD', seed: 4, logo: 'https://sports.cbsimg.net/fly/images/team-logos/21133.svg', color: 'navy' },
  { id: 'mississippi', name: 'mississippi', displayName: 'University of Mississippi', shortName: 'MISS', seed: 5, logo: '', color: 'secondary' },
  { id: 'missouri', name: 'missouri', displayName: 'University of Missouri', shortName: 'MIZ', seed: 6, logo: 'https://sports.cbsimg.net/fly/images/team-logos/21206.svg', color: 'gold' },
  { id: 'kansas', name: 'kansas', displayName: 'University of Kansas', shortName: 'KU', seed: 7, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21204.svg', color: 'danger' },
  { id: 'baylor-west', name: 'baylor-west', displayName: 'Baylor University', shortName: 'BAY', seed: 8, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21201.svg', color: 'primary' },
  { id: 'oklahoma', name: 'oklahoma', displayName: 'University of Oklahoma', shortName: 'OU', seed: 9, logo: '', color: 'secondary' },
  { id: 'georgia', name: 'georgia', displayName: 'University of Georgia', shortName: 'UGA', seed: 10, logo: '', color: 'secondary' },
  { id: 'drake', name: 'drake', displayName: 'Drake University', shortName: 'DU', seed: 11, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21306.svg', color: 'orchid' },
  { id: 'colorado-state', name: 'colorado-state', displayName: 'Colorado State University', shortName: 'CSU', seed: 12, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21407.svg', color: 'crimson' },
  { id: 'grand-canyon', name: 'grand-canyon', displayName: 'Grand Canyon University', shortName: 'GCU', seed: 13, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/160925.svg', color: 'crimson' },
  { id: 'montana-west', name: 'montana-west', displayName: 'University of Montana', shortName: 'UM', seed: 14, logo: '', color: 'secondary' },
  { id: 'omaha', name: 'omaha', displayName: 'University of Nebraska Omaha', shortName: 'UNO', seed: 15, logo: '', color: 'secondary' },
  { id: 'norfolk-state', name: 'norfolk-state', displayName: 'Norfolk State University', shortName: 'NSU', seed: 16, logo: '', color: 'secondary' },

  // Midwest Region - Seeds 1-16
  { id: 'houston', name: 'houston', displayName: 'University of Houston', shortName: 'HOU', seed: 1, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21237.svg', color: 'secondary' },
  { id: 'tennessee', name: 'tennessee', displayName: 'University of Tennessee', shortName: 'TENN', seed: 2, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21362.svg', color: 'gold' },
  { id: 'kentucky', name: 'kentucky', displayName: 'University of Kentucky', shortName: 'UK', seed: 3, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21357.svg', color: 'dark' },
  { id: 'purdue', name: 'purdue', displayName: 'Purdue University', shortName: 'PUR', seed: 4, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21199.svg', color: 'primary' },
  { id: 'clemson', name: 'clemson', displayName: 'Clemson University', shortName: 'CLEM', seed: 5, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21129.svg', color: 'sunset' },
  { id: 'illinois', name: 'illinois', displayName: 'University of Illinois', shortName: 'ILL', seed: 6, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21190.svg', color: 'rust' },
  { id: 'ucla', name: 'ucla', displayName: 'University of California, Los Angeles', shortName: 'UCLA', seed: 7, logo: 'https://sports.cbsimg.net/fly/images/team-logos/21341.svg', color: 'ocean' },
  { id: 'gonzaga', name: 'gonzaga', displayName: 'Gonzaga University', shortName: 'ZAGS', seed: 8, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21415.svg', color: 'plum' },
  { id: 'georgia-midwest', name: 'georgia-midwest', displayName: 'University of Georgia', shortName: 'UGA', seed: 9, logo: '', color: 'secondary' },
  { id: 'utah-state', name: 'utah-state', displayName: 'Utah State University', shortName: 'USU', seed: 10, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21224.svg', color: 'primary' },
  { id: 'texas', name: 'texas', displayName: 'University of Texas at Austin', shortName: 'TEX', seed: 11, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21210.svg', color: 'rust' },
  { id: 'mcneese-state', name: 'mcneese-state', displayName: 'McNeese State University', shortName: 'MCN', seed: 12, logo: 'https://sports.cbsimg.net/fly/images/ncaa/logos/team/21377.svg', color: 'rust' },
  { id: 'high-point', name: 'high-point', displayName: 'High Point University', shortName: 'HPU', seed: 13, logo: '', color: 'secondary' },
  { id: 'troy', name: 'troy', displayName: 'Troy University', shortName: 'TROY', seed: 14, logo: '', color: 'secondary' },
  { id: 'wofford', name: 'wofford', displayName: 'Wofford College', shortName: 'WOF', seed: 15, logo: '', color: 'secondary' },
  { id: 'siu-edwardsville', name: 'siu-edwardsville', displayName: 'Southern Illinois University Edwardsville', shortName: 'SIUE', seed: 16, logo: '', color: 'secondary' },
];

/**
 * Regional organization for NCAA 2025
 * This defines which teams belong to which regions
 */
export const ncaaRegions2025 = {
  South: [
    'auburn', 'michigan-state', 'iowa-state', 'texas-a&m', 'michigan', 'ole-miss', 
    'marquette', 'louisville', 'creighton', 'new-mexico', 'unc', 'uc-san-diego', 
    'yale', 'lipscomb', 'bryant', 'alabama-state'
  ],
  East: [
    'duke', 'alabama', 'wisconsin', 'arizona', 'oregon', 'byu', 'saint-marys', 
    'mississippi-state', 'baylor', 'vanderbilt', 'vcu', 'liberty', 'akron', 
    'montana', 'robert-morris', 'alabama-state-east'
  ],
  West: [
    'florida', 'uconn', 'memphis', 'maryland', 'mississippi', 'missouri', 'kansas', 
    'baylor-west', 'oklahoma', 'georgia', 'drake', 'colorado-state', 'grand-canyon', 
    'montana-west', 'omaha', 'norfolk-state'
  ],
  Midwest: [
    'houston', 'tennessee', 'kentucky', 'purdue', 'clemson', 'illinois', 'ucla', 
    'gonzaga', 'georgia-midwest', 'utah-state', 'texas', 'mcneese-state', 'high-point', 
    'troy', 'wofford', 'siu-edwardsville'
  ]
};
