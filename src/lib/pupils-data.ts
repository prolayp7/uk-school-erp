// Synthetic demo data only — no real pupil records, per design.md §15.

export type Carer = {
  name: string;
  relationship: string;
  priority: 1 | 2;
  parentalResponsibility: boolean;
  portalActive: boolean;
  mobile: string;
  mobileVerified: boolean;
  email: string;
  emailPortalActive: boolean;
  workPhone?: string;
  workPhoneNote?: string;
  address: { line1: string; line2: string; postcode: string; livesWithPupil: boolean; verifiedDate?: string };
};

export type Pupil = {
  id: string;
  legalForename: string;
  legalSurname: string;
  preferredName?: string;
  pronoun: string;
  initials: string;
  upn: string;
  admissionNo: string;
  dob: string;
  age: string;
  gender: string;
  yearGroup: string;
  form: string;
  tutor: string;
  house: string;
  houseLead: string;
  attendance: number;
  attendanceTone: "success" | "warning" | "danger";
  status: "Active" | "Leaver" | "Dual-Registered";
  flags: Array<{ label: string; tone: "neutral" | "info" | "brand"; title?: string }>;
  pupilPremium: boolean;
  sendCode?: "K" | "E";
  enrolmentDate: string;
  siblingIds?: string[];
  carers?: Carer[];
};

export const PUPILS: Pupil[] = [
  {
    id: "liam-turner",
    legalForename: "Liam",
    legalSurname: "Turner",
    pronoun: "He/Him",
    initials: "LT",
    upn: "W801202319044",
    admissionNo: "2019-0412",
    dob: "14/03/2010",
    age: "14y 7m",
    gender: "Male",
    yearGroup: "Year 10",
    form: "10B",
    tutor: "Mr D. Patel",
    house: "Bede",
    houseLead: "Mrs C. Vance",
    attendance: 88.4,
    attendanceTone: "danger",
    status: "Active",
    flags: [
      { label: "PP", tone: "neutral", title: "Pupil Premium" },
      { label: "Asthma", tone: "info", title: "Medical alert" },
    ],
    pupilPremium: true,
    enrolmentDate: "03/09/2019",
    siblingIds: ["jack-turner"],
    carers: [
      {
        name: "Sarah Turner",
        relationship: "Mother",
        priority: 1,
        parentalResponsibility: true,
        portalActive: true,
        mobile: "07700 900124",
        mobileVerified: true,
        email: "sarah.turner81@gmail.com",
        emailPortalActive: true,
        workPhone: "0191 498 0122",
        workPhoneNote: "Ext. 204 (NHS Foundation Trust)",
        address: {
          line1: "14 St Jude's Terrace",
          line2: "Jesmond, Newcastle upon Tyne",
          postcode: "NE2 1AB",
          livesWithPupil: true,
          verifiedDate: "12/09/2024",
        },
      },
      {
        name: "Mark Turner",
        relationship: "Father",
        priority: 2,
        parentalResponsibility: true,
        portalActive: false,
        mobile: "07700 900588",
        mobileVerified: false,
        email: "mark.turner@outlook.com",
        emailPortalActive: false,
        address: {
          line1: "Second address",
          line2: "Jesmond, Newcastle upon Tyne",
          postcode: "NE2 2CD",
          livesWithPupil: false,
        },
      },
    ],
  },
  {
    id: "maya-kapoor",
    legalForename: "Maya",
    legalSurname: "Kapoor",
    pronoun: "She/Her",
    initials: "MK",
    upn: "E801202410882",
    admissionNo: "2020-0198",
    dob: "28/11/2010",
    age: "13y 10m",
    gender: "Female",
    yearGroup: "Year 9",
    form: "9H",
    tutor: "Mr R. Geller",
    house: "Cuthbert",
    houseLead: "Mr A. Reid",
    attendance: 92.6,
    attendanceTone: "warning",
    status: "Active",
    flags: [
      { label: "PP", tone: "neutral", title: "Pupil Premium" },
      { label: "EAL", tone: "neutral", title: "English as an Additional Language" },
    ],
    pupilPremium: true,
    enrolmentDate: "01/09/2020",
  },
  {
    id: "ethan-sinclair",
    legalForename: "Ethan",
    legalSurname: "Sinclair",
    pronoun: "He/Him",
    initials: "ES",
    upn: "K801202298711",
    admissionNo: "2018-0551",
    dob: "03/05/2008",
    age: "16y 4m",
    gender: "Male",
    yearGroup: "Year 11",
    form: "11C",
    tutor: "Mr Bradley",
    house: "Aidan",
    houseLead: "Ms F. Oyelaran",
    attendance: 96.8,
    attendanceTone: "success",
    status: "Active",
    flags: [{ label: "SEN: K", tone: "brand", title: "SEND Support — Code K" }],
    pupilPremium: false,
    sendCode: "K",
    enrolmentDate: "02/09/2018",
  },
  {
    id: "sophie-robinson",
    legalForename: "Sophie",
    legalSurname: "Robinson",
    pronoun: "She/Her",
    initials: "SR",
    upn: "P801202523310",
    admissionNo: "2023-0201",
    dob: "19/01/2013",
    age: "11y 9m",
    gender: "Female",
    yearGroup: "Year 7",
    form: "7A",
    tutor: "Miss Thorne",
    house: "Bede",
    houseLead: "Mrs C. Vance",
    attendance: 97.9,
    attendanceTone: "success",
    status: "Active",
    flags: [],
    pupilPremium: false,
    enrolmentDate: "04/09/2023",
  },
  {
    id: "jack-turner",
    legalForename: "Jack",
    legalSurname: "Turner",
    pronoun: "He/Him",
    initials: "JT",
    upn: "W801202521099",
    admissionNo: "2021-0387",
    dob: "22/06/2012",
    age: "12y 3m",
    gender: "Male",
    yearGroup: "Year 8",
    form: "8C",
    tutor: "Mrs Jenkins",
    house: "Bede",
    houseLead: "Mrs C. Vance",
    attendance: 95.1,
    attendanceTone: "success",
    status: "Active",
    flags: [{ label: "SEN: E", tone: "brand", title: "SEND — EHCP" }],
    pupilPremium: false,
    sendCode: "E",
    enrolmentDate: "02/09/2021",
    siblingIds: ["liam-turner"],
  },
  {
    id: "fatima-al-mansoor",
    legalForename: "Fatima",
    legalSurname: "Al-Mansoor",
    pronoun: "She/Her",
    initials: "FA",
    upn: "T801202409215",
    admissionNo: "2020-0044",
    dob: "07/02/2011",
    age: "13y 7m",
    gender: "Female",
    yearGroup: "Year 9",
    form: "9C",
    tutor: "Mrs Jenkins",
    house: "Cuthbert",
    houseLead: "Mr A. Reid",
    attendance: 98.2,
    attendanceTone: "success",
    status: "Active",
    flags: [{ label: "EAL", tone: "neutral" }],
    pupilPremium: false,
    enrolmentDate: "01/09/2020",
  },
  {
    id: "lucas-green",
    legalForename: "Lucas",
    legalSurname: "Green",
    pronoun: "He/Him",
    initials: "LG",
    upn: "N801202298644",
    admissionNo: "2018-0602",
    dob: "30/08/2008",
    age: "16y",
    gender: "Male",
    yearGroup: "Year 11",
    form: "11A",
    tutor: "Dr Thorne",
    house: "Aidan",
    houseLead: "Ms F. Oyelaran",
    attendance: 94.0,
    attendanceTone: "warning",
    status: "Active",
    flags: [{ label: "PP", tone: "neutral" }],
    pupilPremium: true,
    enrolmentDate: "03/09/2018",
  },
  {
    id: "chloe-simmons",
    legalForename: "Chloe",
    legalSurname: "Simmons",
    pronoun: "She/Her",
    initials: "CS",
    upn: "R801202299871",
    admissionNo: "2018-0119",
    dob: "11/12/2008",
    age: "15y 9m",
    gender: "Female",
    yearGroup: "Year 10",
    form: "10A",
    tutor: "Ms Wright",
    house: "Cuthbert",
    houseLead: "Mr A. Reid",
    attendance: 99.1,
    attendanceTone: "success",
    status: "Active",
    flags: [{ label: "Medical", tone: "info", title: "Medical alert" }],
    pupilPremium: false,
    enrolmentDate: "03/09/2018",
  },
];

export function getPupilById(id: string): Pupil | undefined {
  return PUPILS.find((pupil) => pupil.id === id);
}

// Lightweight, plausible carer pair for pupils that don't carry hand-authored
// carer detail — keeps the Contacts drawer functional for every directory row.
export function getCarers(pupil: Pupil): Carer[] {
  if (pupil.carers) return pupil.carers;
  return [
    {
      name: `${pupil.gender === "Female" ? "Ms" : "Mr"} ${pupil.legalSurname}`,
      relationship: pupil.gender === "Female" ? "Mother" : "Father",
      priority: 1,
      parentalResponsibility: true,
      portalActive: true,
      mobile: "07700 900000",
      mobileVerified: true,
      email: `${pupil.legalSurname.toLowerCase().replace(/[^a-z]/g, "")}.family@example.co.uk`,
      emailPortalActive: true,
      address: {
        line1: "Address on file",
        line2: "Details verified at enrolment",
        postcode: "—",
        livesWithPupil: true,
      },
    },
  ];
}
